package main

import (
	"DialogFlowFulfilment/application"
)

func main() {
	gameManger := application.GameManger{}
	gameManger.Start()
}
