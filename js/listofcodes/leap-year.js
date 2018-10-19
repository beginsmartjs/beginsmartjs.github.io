function checkLeapvalue(value) {

    var leap = false;

    if(value % 4 == 0)
    {
        if( value % 100 == 0)
        {
            // value is divisible by 400, hence the value is a leap value
            if ( value % 400 == 0)
                leap = true;
            else
                leap = false;
        }
        else
            leap = true;
    }
    else
        leap = false;


    return leap;
}