deploy:
	sudo docker run --rm --volume='/home/cest/Workspace/arsus/apps/bot:/src' --volumes-from gcloud-config gcr.io/google.com/cloudsdktool/cloud-sdk gcloud functions deploy DialogFlowFulfilment --runtime go113 --trigger-http --allow-unauthenticated --source /src
