import '../../flutter_flow/flutter_flow_theme.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class WebAppWidget extends StatefulWidget {
  WebAppWidget({Key key}) : super(key: key);

  @override
  _WebAppWidgetState createState() => _WebAppWidgetState();
}

class _WebAppWidgetState extends State<WebAppWidget> {
  final scaffoldKey = GlobalKey<ScaffoldState>();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: scaffoldKey,
    );
  }
}
