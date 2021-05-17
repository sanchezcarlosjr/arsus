import 'package:arsus/services/backend/firebase_storage/storage.dart';
import 'package:arsus/views/theme/theme.dart';
import 'package:arsus/views/theme/widgets.dart';
import 'package:arsus/views/theme/upload_media.dart';

import 'i_n_e_success_page_widget.dart';
import 'package:auto_size_text/auto_size_text.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class InePageWidget extends StatefulWidget {
  InePageWidget({Key key}) : super(key: key);

  @override
  _InePageWidgetState createState() => _InePageWidgetState();
}

class _InePageWidgetState extends State<InePageWidget> {
  String uploadedFileUrl;
  final scaffoldKey = GlobalKey<ScaffoldState>();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: scaffoldKey,
      appBar: AppBar(
        backgroundColor: Color(0x00F5F5F5),
        automaticallyImplyLeading: false,
        title: Text(
          '¿Está vigente tu credencial?',
          style: FlutterFlowTheme.title3.override(
            fontFamily: 'IBM Plex Sans',
          ),
        ),
        actions: [],
        centerTitle: false,
        elevation: 0,
      ),
      body: SafeArea(
        child: Row(
          mainAxisSize: MainAxisSize.max,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Column(
              mainAxisSize: MainAxisSize.max,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                FFButtonWidget(
                  onPressed: () async {
                    final selectedMedia = await selectMedia(
                      fromCamera: true,
                    );
                    if (selectedMedia != null &&
                        validateFileFormat(
                            selectedMedia.storagePath, context)) {
                      showUploadMessage(context, 'Uploading file...',
                          showLoading: true);
                      final downloadUrl = await uploadData(
                          selectedMedia.storagePath, selectedMedia.bytes);
                      ScaffoldMessenger.of(context).hideCurrentSnackBar();
                      if (downloadUrl != null) {
                        setState(() => uploadedFileUrl = downloadUrl);
                        showUploadMessage(context, 'Success!');
                      } else {
                        showUploadMessage(context, 'Failed to upload media');
                      }
                    }
                    await Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => INESuccessPageWidget(),
                      ),
                    );
                  },
                  text: 'Verifica tu credencial con tu cámara',
                  options: FFButtonOptions(
                    width: 300,
                    height: 40,
                    color: FlutterFlowTheme.primaryColor,
                    textStyle: FlutterFlowTheme.subtitle2.override(
                      fontFamily: 'IBM Plex Sans',
                      color: Colors.white,
                    ),
                    borderSide: BorderSide(
                      color: Colors.transparent,
                      width: 1,
                    ),
                    borderRadius: 0,
                  ),
                ),
                AutoSizeText(
                  'Verifica tu INE en la lista nominal:\nmodelo  C, D, E, F, G y H. \nCualquier modelo anterior a 2008 no puede \nvotar ni  —por extensión legal— servir como \nidentificación oficial.',
                  textAlign: TextAlign.start,
                  style: FlutterFlowTheme.bodyText1.override(
                    fontFamily: 'IBM Plex Sans',
                  ),
                )
              ],
            )
          ],
        ),
      ),
    );
  }
}