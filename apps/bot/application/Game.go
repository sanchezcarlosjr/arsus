package application

type game interface {
	Reply()
	save(tree *game)
}
