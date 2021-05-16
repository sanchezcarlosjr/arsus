import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';
import 'package:built_collection/built_collection.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

import 'schema_util.dart';
import 'serializers.dart';

part 'content_record.g.dart';

abstract class ContentRecord
    implements Built<ContentRecord, ContentRecordBuilder> {
  static Serializer<ContentRecord> get serializer => _$contentRecordSerializer;

  @nullable
  String get title;

  @nullable
  @BuiltValueField(wireName: kDocumentReferenceField)
  DocumentReference get reference;

  static void _initializeBuilder(ContentRecordBuilder builder) =>
      builder..title = '';

  static CollectionReference get collection =>
      FirebaseFirestore.instance.collection('content');

  static Stream<ContentRecord> getDocument(DocumentReference ref) => ref
      .snapshots()
      .map((s) => serializers.deserializeWith(serializer, serializedData(s)));

  ContentRecord._();
  factory ContentRecord([void Function(ContentRecordBuilder) updates]) =
      _$ContentRecord;
}

Map<String, dynamic> createContentRecordData({
  String title,
}) =>
    serializers.serializeWith(
        ContentRecord.serializer, ContentRecord((c) => c..title = title));

ContentRecord get dummyContentRecord {
  final builder = ContentRecordBuilder()..title = dummyString;
  return builder.build();
}

List<ContentRecord> createDummyContentRecord({int count}) =>
    List.generate(count, (_) => dummyContentRecord);
