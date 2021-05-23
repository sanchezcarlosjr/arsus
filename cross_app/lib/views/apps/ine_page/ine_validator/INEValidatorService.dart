import 'package:cloud_functions/cloud_functions.dart';

abstract class INEValidatorService {
  Future<Map<String, dynamic>> validate(String obverseUrl, String backUrl);
}

class INEValidatorCloudFunction extends INEValidatorService {
  @override
  Future<Map<String, dynamic>> validate(
      String obverseUrl, String backUrl) async {
    HttpsCallable callable =
        FirebaseFunctions.instance.httpsCallable('validateINE');
    final results =
        await callable({"obverseUrl": obverseUrl, "backUrl": backUrl});
    return results.data;
  }
}
