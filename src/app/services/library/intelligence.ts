export class Intelligence {

  GENERATE_GISID() {
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var text = 'GIS-';
    var len = 12;
    for (var i = 0; i < len; i++)
      text += charset.charAt(Math.floor(Math.random() * charset.length));
    return text;
  }

  GENERATE_BSN() {
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var text = 'BSN-';
    var len = 12;
    for (var i = 0; i < len; i++)
      text += charset.charAt(Math.floor(Math.random() * charset.length));
    return text;
  }

  ID_GEN() {
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var text = 'ID-';
    var len = 12;
    for (var i = 0; i < len; i++)
      text += charset.charAt(Math.floor(Math.random() * charset.length));
    return text;
  }

}