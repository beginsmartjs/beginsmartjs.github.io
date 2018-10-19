function checkPrimeNumber(value) {
	var flag = false;
	for (var i = 2; i <= value/2; i++) {
		if(value%i==0){
			flag = true;
			break;
		}
	}

	if(value==0||value==1)
		return false;

	if(value==2||value==3)
		return true;

	return !flag;
}