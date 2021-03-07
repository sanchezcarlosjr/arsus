package main

import (
	"DialogFlowFulfilment/application"
	"DialogFlowFulfilment/infraestructure"
)

func main() {
	fileRepository := infraestructure.FileRepository{}
	fileRepository.Read("./questions.txt")
	gameManger := application.GameManger{
		SizeChildren: 2,
	}
	gameManger.Start(fileRepository)
}
