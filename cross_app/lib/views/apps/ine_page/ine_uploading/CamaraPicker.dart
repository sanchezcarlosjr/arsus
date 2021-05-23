import 'package:arsus/views/apps/ine_page/ine_uploading/ImageUploaderFailState.dart';
import 'package:arsus/views/apps/ine_page/ine_uploading/State.dart';
import 'package:arsus/views/theme/upload_media.dart';

import 'ImageUploaderState.dart';

class CamaraPickerState extends INEUploaderState {
  final String message;

  CamaraPickerState(this.message);

  @override
  Future<Map<String, dynamic>> upload(Map<String, dynamic> stateContext) async {
    showUploadMessage(stateContext["buildContext"], this.message,
        showLoading: false);
    stateContext["selectedMedia"] = await selectMedia(fromCamera: true);
    final isValidImage = stateContext["selectedMedia"] != null &&
        validateFileFormat(stateContext["selectedMedia"].storagePath,
            stateContext["buildContext"]);
    return isValidImage
        ? ImageUploaderState().upload(stateContext)
        : ImageUploaderFailState().upload(stateContext);
  }
}
