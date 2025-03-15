# Nice guide
# https://www.olioapps.com/blog/the-lost-art-of-the-makefile

host := mile
deploy_files := assets components lib app.js index.html store.js style.css

all:

deploy: push

push:
	#ssh -T $(host) "mkdir -p ~/last-mile-app"
	rsync --delete --verbose --archive --compress --rsh=ssh $(deploy_files) $(host):~/last-mile-app

FORCE:

.PHONY: all push
