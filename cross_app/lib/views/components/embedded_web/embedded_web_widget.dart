import 'package:flutter/material.dart';

class EmbeddedWebWidget extends StatefulWidget {
  EmbeddedWebWidget({Key key}) : super(key: key);

  @override
  _EmbeddedWeState createState() => _EmbeddedWeState();
}

class _EmbeddedWeState extends State<EmbeddedWebWidget> {
  final scaffoldKey = GlobalKey<ScaffoldState>();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: scaffoldKey,
    );
  }
}
