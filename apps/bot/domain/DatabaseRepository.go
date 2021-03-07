package domain

type DatabaseRepository interface {
	Row(index int) (string, string)
	Length() int
}
