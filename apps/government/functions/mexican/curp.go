package main

import (
	"bytes"
	"errors"
	"regexp"
	"strconv"
	"strings"

	"golang.org/x/text/transform"
	"golang.org/x/text/unicode/norm"
)

//https://github.com/wmark/caddy.upload/blob/master/upload.go

var (
	ordinaryNames = [...]string{"MARIA", "MA", "MA.", "JOSE", "J", "J."}

	inappropriateWords = [...]string{"BACA", "LOCO", "BUEI", "BUEY", "MAME", "CACA", "MAMO",
		"CACO", "MEAR", "CAGA", "MEAS", "CAGO", "MEON", "CAKA", "MIAR", "CAKO", "MION",
		"COGE", "MOCO", "COGI", "MOKO", "COJA", "MULA", "COJE", "MULO", "COJI", "NACA",
		"COJO", "NACO", "COLA", "PEDA", "CULO", "PEDO", "FALO", "PENE", "FETO", "PIPI",
		"GETA", "PITO", "GUEI", "POPO", "GUEY", "PUTA", "JETA", "PUTO", "JOTO", "QULO",
		"KACA", "RATA", "KACO", "ROBA", "KAGA", "ROBE", "KAGO", "ROBO", "KAKA", "RUIN",
		"KAKO", "SENO", "KOGE", "TETA", "KOGI", "VACA", "KOJA", "VAGA", "KOJE", "VAGO",
		"KOJI", "VAKA", "KOJO", "VUEI", "KOLA", "VUEY", "KULO", "WUEI", "LILO", "WUEY",
		"LOCA"}

	// Official codes: https://es.wikipedia.org/wiki/ISO_3166-2:MX
	codeStates = [...]string{"AS", "BC", "BS", "CC", "CS", "CH", "CL", "CM", "DF", "DG",
		"GT", "GR", "HG", "JC", "MC", "MN", "MS", "NT", "NL", "OC", "PL", "QT",
		"QR", "SP", "SL", "SR", "TC", "TS", "TL", "VZ", "YN", "ZS", "NE"}

	characteresDigitVerified = [...]string{"0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E",
		"F", "G", "H", "I", "J", "K", "L", "M", "N", "Ñ", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"}

	conpoundNames = [...]string{"DA", "DAS", "DE", "DEL", "DER", "DI", "DIE", "DD", "EL", "LA", "LOS", "LAS", "LE",
		"LES", "MAC", "MC", "VAN", "VON", "Y"}
)

type curp struct {
	name           string
	firstLastName  string
	secondLastName string
	sex            string
	stateCode      string
	// year, month, day (xxxx-xx-xx)
	birthDate string

	// Optional, It values is used in order to avoid duplicates, it is assign by the Goverment.
	// By default is 0 if the datebirth is smaller or equal to 1999, or the value is A if the value is greatest than 2000
	homonimia string
}

const (
	errStateInvalid curpError = "State is invalid"
	errSexInvalid   curpError = "Sex initial is invalid, you have to use M or H"
)

type curpError string

// Error implements the error interface.
func (e curpError) Error() string { return string(e) }

// NewCurp generates a new curp
func NewCurp(mexican Mexican) (string, error) {
	c := &curp{
		name:           strings.ToUpper(mexican.name),
		firstLastName:  strings.ToUpper(mexican.fatherName),
		secondLastName: strings.ToUpper(mexican.motherName),
		sex:            strings.ToUpper(mexican.toCURPGender()),
		stateCode:      strings.ToUpper(mexican.toCURPBirthState()),
		birthDate:      strings.ToUpper(mexican.toCURPBirthday()),
	}

	generatedCurp, errCurp := c.generate()

	if errCurp != nil {
		return "", errCurp
	}

	return generatedCurp, nil
}

func (c curp) generate() (string, error) {
	var join bytes.Buffer

	year, birthDate := getBirthDate(c.birthDate)
	homonimia := getHomonimia(year)

	join.WriteString(c.getFirstFourInitials())
	join.WriteString(birthDate)

	sex, sexErr := c.getSex()
	if sexErr != nil {
		return "", sexErr
	}
	join.WriteString(sex)

	state, stateErr := c.getState()
	if stateErr != nil {
		return "", stateErr
	}
	join.WriteString(state)

	join.WriteString(c.getConsonants())
	join.WriteString(homonimia)
	join.WriteString(addVerifiedDigit(join.String()))

	return join.String(), nil
}

func (c curp) getSex() (string, error) {
	sex, errSex := isValidSex(c.sex)
	if errSex != nil {
		return "", errSex
	}
	return sex, nil
}

func (c curp) getState() (string, error) {
	state, errState := validState(c.stateCode)
	if errState != nil {
		return "", errState
	}
	return state, nil
}

func (c curp) getConsonants() string {
	var initials bytes.Buffer
	initials.WriteString(getFirstConsonant(validFirstLastName(c.firstLastName)))
	initials.WriteString(getFirstConsonant(c.secondLastName))
	initials.WriteString(getFirstConsonant(c.name))

	return initials.String()
}

func (c curp) getFirstFourInitials() string {
	var initials bytes.Buffer
	initials.WriteString(getInitial(validFirstLastName(c.firstLastName)))
	initials.WriteString(getFirstVowel(validFirstLastName(c.firstLastName)))
	initials.WriteString(getInitial(c.secondLastName))
	initials.WriteString(getInitial(c.name))

	return filterInappropriateWord(initials.String())
}

func validFirstLastName(firstLastName string) string {
	firstLastNames := strings.SplitAfter(firstLastName, " ")

	firstWord := strings.Replace(firstLastNames[0], " ", "", -1)

	if isConpoundNameInvalid(firstWord) {
		return strings.Replace(firstLastNames[1], " ", "", -1)
	}

	return firstWord
}

func isConpoundNameInvalid(word string) bool {
	wordSplited := strings.SplitAfter(word, " ")
	first := strings.Replace(wordSplited[0], " ", "", -1)

	for _, compoundName := range conpoundNames {
		if strings.ToUpper(first) == compoundName {
			return true
		}
	}
	return false
}

func filterInappropriateWord(word string) string {
	var re = regexp.MustCompile(`^(\w)\w`)

	for _, w := range inappropriateWords {
		w = strings.ToUpper(w)
		if w == word {
			word = re.ReplaceAllString(word, "${1}X")
			break
		}
	}
	return word
}

// Example:
// B   A   A  I   8  1  0   8  0  9  H   J   C   R   C   S  0    =  2
// 11, 10, 10, 18, 8, 1, 0,  8, 0, 9, 17, 19, 12, 28, 12, 29, 0

// prev + (value * (18 -  index));

// Example first word
// 11 + (10 *(18-1))
// 11 + (10*17)
// 11 + 170
// result word B: 181

// sumarize:
// total =   1708
// digit = (10 - (total % 10));
func addVerifiedDigit(curp string) string {
	splitCurp := strings.SplitAfter(curp, "")
	values := [17]int{}
	var total int

	for indexCurp, letter := range splitCurp {
		for index, digit := range characteresDigitVerified {
			if letter == digit {
				values[indexCurp] = index
			}
		}
	}

	for idx, val := range values {
		if idx == 0 {
			total = (val * (18 - (1)))
		} else {
			total += values[idx-1] + (val * (18 - (idx + 1)))
		}
	}

	digit := (10 - (total % 10))

	if digit == 10 {
		digit = 0
	}

	return strconv.Itoa(digit)
}

func validState(state string) (string, error) {
	for _, num := range codeStates {
		if num == state {
			return state, nil
		}
	}

	return "", errStateInvalid
}

func isValidSex(sex string) (string, error) {
	if sex == "M" || sex == "H" {
		return sex, nil
	}
	return "", errSexInvalid
}

// Funcion que extrae la inicial del primer nombre, o, si tiene mas de 1 nombre Y el primer
// nombre es uno de la lista de nombres comunes, la inicial del segundo nombre
// @param {string} nombre - String que representa todos los nombres (excepto los apellidos) separados por espacio
func getInitial(fullName string) string {
	fullName = strings.ToUpper(fullName)
	names := strings.SplitAfter(fullName, " ")
	var word string

	if len(names) > 1 {
		for _, name := range ordinaryNames {
			if name == strings.TrimSpace(names[0]) {
				word = validInitial(names[1])
				return word[:1]
			}
		}
	}

	word = validInitial(names[0])

	return word[:1]
}

func validInitial(initial string) string {
	var re = regexp.MustCompile(`(^Ñ)`)
	word := re.ReplaceAllString(initial, "${2}X")
	return word
}

func getFirstVowel(word string) string {
	_, err := validStrangerChar(word)
	if err != nil {
		return "X"
	}

	r := regexp.MustCompile("[A-z]([AEIOU])")
	match := r.FindStringSubmatch(word)

	if len(match) < 2 {
		return "X"
	}
	return match[1]
}

func getFirstConsonant(word string) string {
	_, err := validStrangerChar(word)
	if err != nil {
		return "X"
	}

	r := regexp.MustCompile("[A-z]([BCDFGHJKLMNÑPQRSTVWXYZ])")
	match := r.FindStringSubmatch(word)

	if len(match) < 2 || match[1] == "Ñ" {
		return "X"
	}

	return match[1]
}

func validStrangerChar(word string) (string, error) {
	exceptions := regexp.MustCompile("[\\/|\\-\\.]")
	match := exceptions.FindStringIndex(word)

	if match == nil {
		return word, nil
	}

	return "X", errors.New("Char no valid, contains (/ - .) ")
}

func getBirthDate(birthDate string) (int, string) {
	var date bytes.Buffer
	splited := strings.Split(birthDate, "-")
	year, _ := strconv.Atoi(splited[0])

	date.WriteString(splited[0][2:])
	date.WriteString(splited[1])
	date.WriteString(splited[2])

	return year, date.String()
}

func getHomonimia(year int) string {
	if year > 1999 {
		return "A"
	}
	return "0"
}

// Advanced Unicode normalization and filtering,
// see http://blog.golang.org/normalization and
// http://godoc.org/golang.org/x/text/unicode/norm for more
// details.
func stripCtlAndExtFromUnicode(str string) string {
	isOk := func(r rune) bool {
		return r < 32 || r >= 127
	}
	// The isOk filter is such that there is no need to chain to norm.NFC
	t := transform.Chain(norm.NFKD, transform.RemoveFunc(isOk))
	// This Transformer could also trivially be applied as an io.Reader
	// or io.Writer filter to automatically do such filtering when reading
	// or writing data anywhere.
	str, _, _ = transform.String(t, str)
	return str
}
