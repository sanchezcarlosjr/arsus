import 'package:flutter/material.dart';

import 'App.dart';

class AppMobile extends App {
  AppMobile(Map<String, dynamic> appData): super(appData: appData);
  @override
  Function onTap(BuildContext context) {
    return () => Navigator.pushNamed(context, appData["localRoute"]);
  }
}
