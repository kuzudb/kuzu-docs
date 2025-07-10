import os
import re
import subprocess
import sys

PATTERN = re.compile(
    r'<!--\s*auto-check\s+id=(\S+)(\s+check_only)?\s*-->\s*'
    r'```(cypher|sql)\n(.*?)```'
    r'(\s*```(.*?)```)?',
    re.DOTALL
)

PATTERN_TEST = re.compile(
    r'<!--\s*auto-check\s+id=(\S+)',
    re.DOTALL
)

def strip_ansi(text):
    return re.sub(r'\x1b\[[0-9;]*[a-zA-Z]', '', text)

def parse_auto_check_blocks(md_text):
    results = []
    query_map = {}
    found_ids = set()

    for m in PATTERN.finditer(md_text):
        query_id = m.group(1)
        check_only = m.group(2) is not None
        lang = m.group(3)
        cypher = m.group(4).strip()
        has_output = m.group(5) is not None
        start = m.start()
        end = m.end()

        found_ids.add(query_id)
        results.append((start, end, query_id, lang, cypher, has_output, check_only))
        query_map[query_id] = (cypher, has_output, check_only)
    
    expected_ids = set()
    for m in PATTERN_TEST.finditer(md_text):
        query_id = m.group(1)
        expected_ids.add(query_id)
    
    if found_ids != expected_ids:
        raise Exception(f"Expected ids not found: {expected_ids - found_ids}")
    
    return results, query_map

def execute_query_block(query_id, query_map, kuzu_cli):
    cypher, has_output, check_only = query_map[query_id]

    db_path = f"/tmp/kuzu-docs.kuzu"
    if os.path.exists(db_path):
        os.remove(db_path)

    cmd = f"{kuzu_cli} --nostats --noprogressbar --init scripts/kuzu-cli.txt {db_path}"

    pre = run_pre_queries(query_id, query_map, cmd)
    if pre is not None:
        cypher = pre + cypher

    try:
        result = subprocess.run(
            cmd,
            input=cypher,
            text=True,
            shell=True,
            check=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )
        output = strip_ansi(result.stdout.strip())
        has_error = "error:" in output.lower()
        if check_only or not has_output:
            assert not has_error, f"Query {query_id} should not return an error, but got:\n{output}"
        else:
            if has_error:
                to_find = "Error:"
            else:
                to_find = "┌"
            output = output[output.rfind(to_find):]
            return f"{output}"
    except subprocess.CalledProcessError as e:
        raise Exception(f"{e.stderr.strip()}")

def rewrite_md_file(path, kuzu_cli):

    with open(path, 'r') as f:
        content = f.read()

    new_content = content
    blocks, query_map = parse_auto_check_blocks(content)
    for start, end, query_id, lang, cypher, has_output, check_only in reversed(blocks):
        output = execute_query_block(query_id, query_map, kuzu_cli)
        replacement = (
            f"<!-- auto-check id={query_id}{' check_only' if check_only else ''} -->\n" +
            f"```{lang}\n{cypher}\n```" +
            (f"\n```\n{output}\n```" if has_output and not check_only else "")
        )
        print(replacement)
        if not check_only:
            new_content = new_content[:start] + replacement + new_content[end:]

    with open(path + "_new.md", 'w') as f:
        f.write(new_content)

def run_pre_queries(query_id, query_map, cmd):
    q = None
    pre = None

    if query_id.startswith("call-"):
        match query_id:
            case "call-4" | "call-5" | "call-6" | "call-17":
                q = query_map["call-1"][0]
            case "call-12":
                q = """
                LOAD '/home/artimaeus/Downloads/projects/kuzu/kuzu/extension/vector/build/libvector.kuzu_extension';
                LOAD '/home/artimaeus/Downloads/projects/kuzu/kuzu/extension/fts/build/libfts.kuzu_extension';
                CREATE NODE TABLE Book(id SERIAL PRIMARY KEY, abstract STRING, title STRING, title_embedding FLOAT[384]);
                CALL CREATE_FTS_INDEX(
                    'Book',
                    'book_fts_index',
                    ['abstract', 'title'],
                    stemmer := 'porter'
                );
                CALL CREATE_VECTOR_INDEX(
                    'Book',
                    'book_vector_index',
                    'title_embedding',
                    metric := 'l2'
                );
                """
                pre = """
                LOAD '/home/artimaeus/Downloads/projects/kuzu/kuzu/extension/vector/build/libvector.kuzu_extension';
                LOAD '/home/artimaeus/Downloads/projects/kuzu/kuzu/extension/fts/build/libfts.kuzu_extension';
                """
    else:
        raise Exception(f"Unknown query id: {query_id}")

    if q is not None:
        result = subprocess.run(
            cmd,
            input=q,
            text=True,
            shell=True,
            check=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )
        output = strip_ansi(result.stdout.strip())
        assert "error:" not in output.lower(), f"Pre-query {query_id} should not return an error, but got:\n{output}"

    return pre

if __name__ == "__main__":

    filepath = sys.argv[1]
    kuzu_cli = sys.argv[2]

    rewrite_md_file(filepath, kuzu_cli)
