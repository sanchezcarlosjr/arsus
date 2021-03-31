package main

import (
	"DialogFlowFulfilment/application"
)

func main() {
	gameManger := application.GameManger{
		SizeChildren: 2,
	}
	gameManger.Start()
}
