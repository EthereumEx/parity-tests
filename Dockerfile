FROM ethcore/parity:beta-release

RUN mkdir -p /root/.parity/keys
COPY key.json /root/.parity/keys/
COPY key.pass /root/
COPY chain.json /root/

EXPOSE 8545 8080 8180

ENTRYPOINT ["/build/parity/target/release/parity", "--chain", "/root/chain.json", "--author", "133e5245e3e5ab3f65e73120b34cc29f0f7ba504", "--unlock", "133e5245e3e5ab3f65e73120b34cc29f0f7ba504", "--password", "/root/key.pass", "--rpccorsdomain", "*", "--jsonrpc-interface", "all", "--jsonrpc-hosts", "all", "--force-ui", "--ui-no-validation"]