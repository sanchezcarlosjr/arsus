import 'dart:io';

import 'package:url_launcher/url_launcher.dart';

Future launchURL(String url) async {
  var uri = Uri.parse(url).toString();
  if (await canLaunch(uri)) {
    await launch(uri);
  } else {
    throw 'Could not launch $uri';
  }
}

DateTime get getCurrentTimestamp => DateTime.now();

bool get isIos => Platform.isIOS;
