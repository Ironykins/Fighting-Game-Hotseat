FROM nginx
RUN apt-get update && apt-get install -y nodejs npm supervisor git
RUN rm -rf /usr/share/nginx/html
RUN git clone https://github.com/Ironykins/ironykins.github.io.git /usr/share/nginx/html
RUN git clone https://github.com/Ironykins/Fighting-Game-Hotseat.git /usr/share/nginx/html/fghs
RUN git clone https://github.com/Ironykins/ironigma.git /usr/share/nginx/html/ironigma
RUN npm install -g hookshot
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf
RUN mkdir -p /var/log/supervisor
CMD ["/usr/bin/supervisord"]
