-include Makefile.overrides

IMAGE ?= nodegrace:1.3
FULL_IMAGE_TAG = "$(PREFIX)$(IMAGE)"

all: image push

image:
	@echo "Building image $(FULL_IMAGE_TAG)"
	docker build -t $(FULL_IMAGE_TAG) ./

push:
	docker push $(FULL_IMAGE_TAG)

nontster-run:
	PREFIX=nontster/ make build push && k delete po nodegrace --force --grace-period 0 ; k apply -f pod.nodegrace.yaml && k wait --for=condition=Ready pod/nodegrace && k port-forward nodegrace 8080
