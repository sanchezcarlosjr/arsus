features:
	@godog
test:
	@go test  /home/cest/projects/blog/functions/src/apps/backend/controllers/api
deploy:
	@gcloud functions deploy Curp --runtime go113 --trigger-http --allow-unauthenticated --memory=2048MB
