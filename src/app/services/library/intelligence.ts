export class Intelligence {

  setTitleCase(str) : string {
   var splitStr = str.toLowerCase().split(' ');
   for (var i = 0; i < splitStr.length; i++) {
       // You do not need to check if i is larger than splitStr length, as your for does that for you
       // Assign it back to the array
       splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
   }
   // Directly return the joined string
   return splitStr.join(' ');
  }

  ID_GEN(){
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var text='DM-';
    var len = 16;
    for( var i=0; i < len; i++ )
        text += charset.charAt(Math.floor(Math.random() * charset.length));
    return text;
  }

  codeGen(){
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var text='TTS-';
    var len = 6;
    for( var i=0; i < len; i++ )
        text += charset.charAt(Math.floor(Math.random() * charset.length));
    return text;
  }

  convertToNumber(rate): string {
    if(isNaN(rate)){
      return '0';
    }
    else
    {
      var value : number = rate;
      var num = value.toFixed(0).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
      return num;
    }
    
  }

  convertToMoney(rate): string {
      if(isNaN(rate)){
        return 'N/A';
      }
      else
      {
        var value : number = parseFloat(rate);
        var num = value.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
        return 'N' + num;
      }
      
    }


  createRange(number){
    var items: number[] = [];
    for(var i = 1; i <= number; i++){
      items.push(i);
  }
    return items;
  }

  
  isEmailValid(email) {
    var x = email;
    var atpos = x.indexOf("@");
    var dotpos = x.lastIndexOf(".");
    if (atpos<1 || dotpos<atpos+2 || dotpos+2>=x.length) {
        return false;
    }
    else{
      return true;
    }
  }
  
}