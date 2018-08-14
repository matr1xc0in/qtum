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

RUN sed -i.bak -e 's/v3.7/v3.8/g' /etc/apk/repositories && rm -f /etc/apk/repositories.bak ; \
    apk update --no-cache && apk update && apk upgrade --purge && \
    apk add --no-cache curl bash git \
    openssl \
    build-base \
    && rm -rf /var/cache/apk/*

RUN addgroup -g $QTUM_GID $QTUM_USER && \
    echo $QTUM_UID && \
    adduser -D -u $QTUM_UID -G $QTUM_USER -g $QTUM_GID -h $HOME -S -s /bin/sh $QTUM_USER && \
    chmod g+w /etc/passwd /etc/group ; \
    mkdir -p /dapp ; \
    chown $QTUM_GID /dapp; chgrp -R $QTUM_GID /dapp ; chmod u+srwX,g+srwX /dapp ; 

COPY ./qtumd-launch /usr/local/bin/qtumd-launch

WORKDIR $HOME

RUN cd $HOME; \
    git clone --depth 1 https://github.com/maandree/libkeccak ;\
    cd libkeccak ; \
    make && make install && make clean ;\
    cd $HOME; rm -rf libkeccak ; \
    git clone --depth 1 https://github.com/maandree/sha3sum.git ;\
    cd sha3sum ; \
    make && make install && make clean ;\
    cd $HOME; rm -rf sha3sum

COPY _qtum-wallet-gen.sh $HOME/_qtum-wallet-gen.sh
COPY start_qtumd.sh $HOME/start_qtumd.sh

RUN chmod 755 $HOME/start_qtumd.sh ; chown -R $QTUM_UID:$QTUM_GID $HOME

USER $QTUM_UID
WORKDIR $HOME

ENTRYPOINT ["/home/qtumuser/start_qtumd.sh"]

CMD ["./_qtum-wallet-gen.sh"]
