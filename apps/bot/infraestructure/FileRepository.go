package infraestructure

import (
	"bufio"
	"fmt"
	"os"
	"strings"
)

type FileRepository struct {
	database []string
}

// Row by line. It returns response, responseType
func (receiver *FileRepository) Row(index int) (string, string) {
	line := strings.Split(receiver.database[index], ":")
	return line[1], line[0]
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
