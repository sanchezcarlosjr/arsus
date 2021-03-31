deploy:
	sudo docker run --rm --volume='/home/cest/Workspace/arsus/apps/bot:/src' --volumes-from gcloud-config gcr.io/google.com/cloudsdktool/cloud-sdk gcloud functions deploy DialogFlowFulfilment --runtime go113 --trigger-http --allow-unauthenticated --source /src

build:
	GOOS=windows GOARCH=amd64 go build -o bin/20QuestionsGame-WinAmd64.exe main.go
	GOOS=windows GOARCH=386 go build -o bin/20QuestionsGame-Win386.exe main.go
	GOOS=darwin GOARCH=amd64 go build -o bin/20QuestionsGame-DarwinAmd64 main.go
	GOOS=linux GOARCH=amd64 go build -o bin/20QuestionsGame-LinuxAmd64 main.go
	GOOS=linux GOARCH=386 go build -o bin/20QuestionsGame-Linux386 main.go
