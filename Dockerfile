FROM nginx:1.27-alpine
# Render setzt PORT; der nginx-Entrypoint ersetzt ${PORT} in der Vorlage beim Start.
ENV PORT=10000
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY index.html style.css /usr/share/nginx/html/
COPY js /usr/share/nginx/html/js
COPY vendor /usr/share/nginx/html/vendor
EXPOSE 10000
