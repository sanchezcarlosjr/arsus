package main

import (
	"DialogFlowFulfilment/application"
	"fmt"
	"os"
	"os/exec"
	"runtime"
	"time"
)

func main() {
	userResponse := "y"
	for userResponse == "y" || userResponse == "yes" || userResponse == "0" {
		fmt.Println("===========================================================================================================")
		fmt.Println("\tSanchezCarlosJr 1.1 My YouTube channel https://www.youtube.com/c/Arsustech/videos")
		fmt.Println("===========================================================================================================")
		gameManger := application.GameManger{}
		fmt.Println("Answer with yes (y), no (n), or previous (p)")
		gameManger.Start()
		fmt.Println("Great, I got it right!")
		time.Sleep(2 * time.Second)
		fmt.Println("\nDo you want to go again? (y/n)")
		_, _ = fmt.Scan(&userResponse)
		CallClear()
	}
}

var clear map[string]func() //create a map for storing clear funcs

func init() {
	clear = make(map[string]func()) //Initialize it
	clear["linux"] = func() {
		cmd := exec.Command("clear") //Linux example, its tested
		cmd.Stdout = os.Stdout
		cmd.Run()
	}
	clear["darwin"] = func() {
		cmd := exec.Command("clear") //Linux example, its tested
		cmd.Stdout = os.Stdout
		cmd.Run()
	}
	clear["windows"] = func() {
		cmd := exec.Command("cmd", "/c", "cls") //Windows example, its tested
		cmd.Stdout = os.Stdout
		cmd.Run()
	}
}

func CallClear() {
	value, ok := clear[runtime.GOOS] //runtime.GOOS -> linux, windows, darwin etc.
	if ok {                          //if we defined a clear func for that platform:
		value() //we execute it
	} else { //unsupported platform
		panic("Your platform is unsupported! I can't clear terminal screen :(")
	}
}
