FROM lipanski/docker-static-website:latest

COPY dist .

CMD ["/busybox-httpd", "httpd", "-f", "-v", "-p", "80", "-c", "httpd.conf"]
