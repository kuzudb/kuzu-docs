FROM node:20-bookworm
COPY . /home/node/app
WORKDIR /home/node/app
RUN npm i
RUN npx astro build
# Disallow all robots for dev documentation
RUN echo "User-agent: *\nDisallow: /" > dist/robots.txt
RUN npm i -g http-server
EXPOSE 8082
CMD [ "http-server", "dist", "-p 8082" ]
