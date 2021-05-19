package infraestructure

import (
	"DialogFlowFulfilment/domain"
	"DialogFlowFulfilment/shared"
	"bufio"
	"fmt"
	"os"
	"strings"
)

type FileRepository struct {
	database      []string
	index         int
	previousIndex int
}

func NewFileRepository(filePath string) domain.DatabaseRepository {
	file := FileRepository{
		index: 0,
	}
	file.Read(filePath)
	return &file
}

func NewFileRepositoryFromStorage(url string, fileName string) domain.DatabaseRepository {
	fileDownloader := shared.FileDownloader{}
	_ = fileDownloader.Download(url, fileName)
	return NewFileRepository(fileName)
}

func LoadFileRepositoryFromStorage() domain.DatabaseRepository {
	fileDownloader := shared.FileDownloader{}
	Translation = NewTranslation("es-MX")
	fileInMemory, _ := fileDownloader.Read(Translation.DatabaseURL)
	file := FileRepository{
		index:    0,
		database: strings.Split(fileInMemory, "\n"),
	}
	return &file
}

func (receiver *FileRepository) Next(index domain.UserResponse) {
	receiver.previousIndex = receiver.index
	receiver.index = 2*receiver.index + int(index) + 1
}

func (receiver *FileRepository) Previous() {
	receiver.index = receiver.previousIndex
}

func (receiver *FileRepository) First() {
	receiver.index = 0
}

func (receiver *FileRepository) Actual() (string, domain.Discriminator) {
	line := strings.Split(receiver.database[receiver.index], ":")
	return line[1], domain.Discriminator(line[0])
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
