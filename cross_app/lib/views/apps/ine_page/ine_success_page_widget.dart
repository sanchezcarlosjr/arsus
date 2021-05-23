import 'package:arsus/views/theme/theme.dart';
import 'package:arsus/views/theme/upload_media.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:image_downloader/image_downloader.dart';
import 'package:share/share.dart';
import 'dart:io';
import 'dart:convert';

class INESuccessPageWidget extends StatefulWidget {
  final bool isValidINE;
  final String url;

  INESuccessPageWidget({this.isValidINE, this.url, Key key}) : super(key: key);

  @override
  _INESuccessPageWidgetState createState() => _INESuccessPageWidgetState();
}

class _INESuccessPageWidgetState extends State<INESuccessPageWidget> {
  final scaffoldKey = GlobalKey<ScaffoldState>();

  @override
  Widget build(BuildContext context) {
    String isValidINE =
        this.widget.isValidINE ? 'Si esta vigente' : "NO esta vigente";
    return Scaffold(
      key: scaffoldKey,
      appBar: AppBar(
        backgroundColor: Color(0x00F5F5F5),
        automaticallyImplyLeading: false,
        title: Text(
          '¿Está vigente tu credencial?',
          style: ArsusTheme.title3,
        ),
        actions: [],
        centerTitle: false,
        elevation: 0,
      ),
      body: SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.max,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Row(
              mainAxisSize: MainAxisSize.max,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Padding(
                  padding: EdgeInsets.fromLTRB(0, 0, 0, 20),
                  child: Text(isValidINE,
                      textAlign: TextAlign.center, style: ArsusTheme.title1),
                )
              ],
            ),
            Column(
              mainAxisSize: MainAxisSize.max,
              children: [
                Padding(
                  padding: EdgeInsets.fromLTRB(0, 0, 0, 20),
                  child: Image.network(
                    this.widget.url,
                    width: MediaQuery.of(context).size.width * 0.9,
                    height: MediaQuery.of(context).size.height * 0.4,
                    fit: BoxFit.cover,
                  ),
                )
              ],
            ),
            Row(
              mainAxisSize: MainAxisSize.max,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                IconButton(
                  onPressed: () {
                    Share.share(widget.url,
                        subject: "Mi INE $isValidINE por Lista Nominal");
                  },
                  icon: Icon(
                    Icons.share,
                    color: Colors.black,
                    size: 30,
                  ),
                  iconSize: 30,
                ),
                IconButton(
                  onPressed: () async {
                    showUploadMessage(context, "Descargando...", showLoading: true);
                    await ImageDownloader.downloadImage(widget.url);
                    showUploadMessage(context, "Descarga finalizada!", showLoading: false);
                  },
                  icon: Icon(
                    Icons.save,
                    color: Colors.black,
                    size: 30,
                  ),
                  iconSize: 30,
                ),
                IconButton(
                  onPressed: () async {
                    ClipboardData data = ClipboardData(text: widget.url);
                    await Clipboard.setData(data);
                    showUploadMessage(context, "Copiado a portapapeles!", showLoading: false);
                  },
                  icon: FaIcon(
                    FontAwesomeIcons.clipboard,
                    color: Colors.black,
                    size: 30,
                  ),
                  iconSize: 30,
                )
              ],
            )
          ],
        ),
      ),
    );
  }
}
