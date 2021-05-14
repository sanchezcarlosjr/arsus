import '../flutter_flow/flutter_flow_theme.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class EssaysWidget extends StatefulWidget {
  EssaysWidget({Key key}) : super(key: key);

  @override
  _EssaysWidgetState createState() => _EssaysWidgetState();
}

class _EssaysWidgetState extends State<EssaysWidget> {
  final scaffoldKey = GlobalKey<ScaffoldState>();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: scaffoldKey,
    );
  }
}
