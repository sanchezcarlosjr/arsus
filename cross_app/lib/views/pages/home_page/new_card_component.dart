import 'package:arsus/views/apps/app/AppWeb.dart';
import 'package:arsus/views/theme/theme.dart';
import 'package:flutter/material.dart';

class NewCardWidget extends StatefulWidget {
  NewCardWidget({this.data, Key key}) : super(key: key);
  final Map<String, dynamic> data;

  @override
  _NewCardWidgetState createState() => _NewCardWidgetState();
}

class _NewCardWidgetState extends State<NewCardWidget> {
  @override
  Widget build(BuildContext context) {
    return Card(
        margin: EdgeInsets.fromLTRB(0, 0, 0, 50),
        clipBehavior: Clip.antiAliasWithSaveLayer,
        color: Color(0xFFEEEEEE),
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(0),
        ),
        child: InkWell(
            onTap: widget.data["type"] == "newspaper" ? AppWeb({"url": 'https://sanchezcarlosjr.com/article/x/${widget.data["uid"]}'}).onTap(context) : () => {},
            child: Column(
                mainAxisSize: MainAxisSize.max,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Padding(
                      padding: EdgeInsets.fromLTRB(5, 15, 15, 25),
                      child: Column(mainAxisSize: MainAxisSize.max, children: [
                        Text(
                          widget.data["title"],
                          textAlign: TextAlign.start,
                          style: FlutterFlowTheme.title1.override(
                            fontFamily: 'IBM Plex Sans',
                          ),
                        ),
                        Padding(
                          padding: EdgeInsets.fromLTRB(0, 10, 0, 0),
                          child: Row(
                            mainAxisSize: MainAxisSize.max,
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                widget.data["source"]["name"],
                                textAlign: TextAlign.start,
                                style: FlutterFlowTheme.subtitle2.override(
                                  fontFamily: 'IBM Plex Sans',
                                ),
                              )
                            ],
                          ),
                        )
                      ]))
                ]))
    );
  }
}
