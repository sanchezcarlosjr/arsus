import 'package:arsus/services/backend/firebase_storage/storage.dart';
import 'package:arsus/views/apps/ine_page/ine_uploading/CamaraPicker.dart';
import 'package:arsus/views/apps/ine_page/ine_uploading/ImageUploaderState.dart';
import 'package:arsus/views/apps/ine_page/ine_uploading/INEApiCaller.dart';
import 'package:arsus/views/theme/theme.dart';
import 'package:arsus/views/theme/widgets.dart';
import 'package:arsus/views/theme/upload_media.dart';

import 'ine_success_page_widget.dart';
import 'package:auto_size_text/auto_size_text.dart';
import 'package:flutter/material.dart';

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
          style: ArsusTheme.title3,
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
                    Map<String, dynamic> obverseContext =
                        await CamaraPickerState("Anverso de INE")
                            .upload({"buildContext": context});
                    Map<String, dynamic> backContext =
                        await CamaraPickerState("Reverso de INE")
                            .upload({"buildContext": context});
                    await INEApiCaller(INEValidatorServiceMock()).validate({
                      "obverseUrl": obverseContext["downloadUrl"],
                      "backUrl": backContext["downloadUrl"],
                      "buildContext": context
                    });
                  },
                  text: 'Verifica tu credencial con tu cámara',
                  options: FFButtonOptions(
                    width: 300,
                    height: 40,
                    color: ArsusTheme.primaryColor,
                    textStyle: ArsusTheme.subtitle2.override(
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
                    style: ArsusTheme.bodyText1)
              ],
            )
          ],
        ),
      ),
    );
  }
}
