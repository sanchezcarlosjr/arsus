package main

import (
	"bufio"
	"fmt"
	"os"
)

type FileRepository struct {
	path  string
	reply []string
}

func (receiver *FileRepository) getFileRepositoryInstance() {
}

func (receiver *FileRepository) getReply(index int) string {
	return receiver.reply[index]
}

func (receiver *FileRepository) read() {
	inFile, err := os.Open(receiver.path)
	if err != nil {
		fmt.Println(err.Error() + `: ` + receiver.path)
		return
	}
	defer inFile.Close()
	scanner := bufio.NewScanner(inFile)
	for scanner.Scan() {
		receiver.reply = append(receiver.reply, scanner.Text())
	}
}
