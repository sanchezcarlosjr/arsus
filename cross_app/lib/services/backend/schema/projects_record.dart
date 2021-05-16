import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';
import 'package:built_collection/built_collection.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

import 'schema_util.dart';
import 'serializers.dart';

part 'projects_record.g.dart';

abstract class ProjectsRecord
    implements Built<ProjectsRecord, ProjectsRecordBuilder> {
  static Serializer<ProjectsRecord> get serializer =>
      _$projectsRecordSerializer;

  @nullable
  String get title;

  @nullable
  String get img;

  @nullable
  @BuiltValueField(wireName: kDocumentReferenceField)
  DocumentReference get reference;

  static void _initializeBuilder(ProjectsRecordBuilder builder) => builder
    ..title = ''
    ..img = '';

  static CollectionReference get collection =>
      FirebaseFirestore.instance.collection('projects');

  static Stream<ProjectsRecord> getDocument(DocumentReference ref) => ref
      .snapshots()
      .map((s) => serializers.deserializeWith(serializer, serializedData(s)));

  ProjectsRecord._();
  factory ProjectsRecord([void Function(ProjectsRecordBuilder) updates]) =
      _$ProjectsRecord;
}

Map<String, dynamic> createProjectsRecordData({
  String title,
  String img,
}) =>
    serializers.serializeWith(
        ProjectsRecord.serializer,
        ProjectsRecord((p) => p
          ..title = title
          ..img = img));

ProjectsRecord get dummyProjectsRecord {
  final builder = ProjectsRecordBuilder()
    ..title = dummyString
    ..img = dummyImagePath;
  return builder.build();
}

List<ProjectsRecord> createDummyProjectsRecord({int count}) =>
    List.generate(count, (_) => dummyProjectsRecord);
