package infraestructure

import (
	"DialogFlowFulfilment/domain"
	"bufio"
	"fmt"
	"os"
	"strings"
)

type FileRepository struct {
	database []string
	length   int
}

func NewFileRepository(filePath string) domain.DatabaseRepository {
	file := FileRepository{}
	file.Read(filePath)
	return &file
}

// Row by line. It returns response, responseType
func (receiver *FileRepository) Row(index int) (string, domain.Discriminator) {
	if receiver.database[index] == "" {
		return "", ""
	}
	line := strings.Split(receiver.database[index], ":")
	return line[1], domain.Discriminator(line[0])
}

func (receiver *FileRepository) Length() int {
	return receiver.length
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
	receiver.length = len(receiver.database)
}
