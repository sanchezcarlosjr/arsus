package infraestructure

import (
	"bufio"
	"fmt"
	"os"
)

type FileRepository struct {
	database []string
}

func (receiver *FileRepository) GetFileRepositoryInstance() {
}

func (receiver *FileRepository) Row(index int) string {
	return receiver.database[index]
}

func (receiver *FileRepository) Length() int {
	return len(receiver.database)
}

func (receiver *FileRepository) Read(path string) {
	inFile, err := os.Open(path)
	if err != nil {
		fmt.Println(err.Error() + `: ` + path)
		return
	}
	defer inFile.Close()
	scanner := bufio.NewScanner(inFile)
	for scanner.Scan() {
		receiver.database = append(receiver.database, scanner.Text())
	}
}
