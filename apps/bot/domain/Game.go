package domain

type game interface {
	Reply()
	save(tree *game)
}
