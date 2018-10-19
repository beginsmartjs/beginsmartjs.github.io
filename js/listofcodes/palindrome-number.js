function checkPalindromeNumber(value) {
	var temp = value;
	var remainder,sum = 0;
	while(value>0){
		remainder = value % 10;
		sum = sum * 10 + remainder;
		value = value - remainder;
		value = value / 10;
	}

	if(temp === sum){
		return true;
	} else {
		return false;
	}
}