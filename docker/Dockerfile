FROM hayeah/qtumportal:latest

LABEL maintainer="matr1xc0in"

ARG QTUM_UID

# UID is the only thing that matters
ENV SHELL=/bin/sh \
    QTUM_USER=qtumuser \
    QTUM_UID=${QTUM_UID} \
    QTUM_GID=5888
ENV HOME=/home/$QTUM_USER

USER root

RUN addgroup -g $QTUM_GID $QTUM_USER && \
    echo $QTUM_UID && \
    adduser -D -u $QTUM_UID -G $QTUM_USER -g $QTUM_GID -h $HOME -S -s /bin/sh $QTUM_USER && \
    chmod g+w /etc/passwd /etc/group ; \
    mkdir -p /dapp ; \
    chown $QTUM_GID /dapp; chgrp -R $QTUM_GID /dapp ; chmod u+srwX,g+srwX /dapp ; 

USER $QTUM_UID
WORKDIR $HOME

CMD ["/bin/sh", "-c", "mkdir -p $QTUM_DATADIR && goreman -f /Procfile start"]

EXPOSE 13888
EXPOSE 3888
EXPOSE 3889
EXPOSE 9888
EXPOSE 9899
