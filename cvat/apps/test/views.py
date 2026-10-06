# Copyright (C) CVAT.ai Corporation
#
# SPDX-License-Identifier: MIT

from collections import defaultdict

from django.db.models import Count
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from cvat.apps.engine.models import (
    LabeledImage,
    LabeledInterval,
    LabeledShape,
    LabeledTrack,
    Task,
)
from cvat.apps.engine.permissions import TaskPermission


class AnnotationCountView(APIView):
    """Return the number of annotations for each label in a task."""

    permission_classes = [IsAuthenticated]
    annotation_models = {
        "image": LabeledImage,
        "shape": LabeledShape,
        "track": LabeledTrack,
        "interval": LabeledInterval,
    }

    def get(self, request):
        task_id = request.query_params.get("task_id")
        if task_id is None:
            return Response({"detail": "task_id is required."}, status=400)

        try:
            task_id = int(task_id)
        except (TypeError, ValueError):
            return Response({"detail": "task_id must be an integer."}, status=400)

        task = get_object_or_404(Task, pk=task_id)
        permission = TaskPermission.create_scope_view(request, task)
        if not permission.check_access().allow:
            return Response({"detail": "You do not have access to this task."}, status=403)

        # Annotation is an abstract model, so each concrete annotation table
        # must be aggregated separately before the results are combined.
        annotation_type = request.query_params.get("annotation_type")
        if annotation_type and annotation_type not in self.annotation_models:
            return Response(
                {
                    "detail": "annotation_type must be one of: "
                    f"{', '.join(self.annotation_models)}."
                },
                status=400,
            )

        annotation_models = (
            (self.annotation_models[annotation_type],)
            if annotation_type
            else tuple(self.annotation_models.values())
        )
        counts = defaultdict(int)
        for annotation_model in annotation_models:
            rows = (
                annotation_model.objects.filter(job__segment__task=task)
                .values("label__name")
                .annotate(count=Count("id"))
                .order_by("label__name")
            )
            for row in rows:
                counts[row["label__name"]] += row["count"]

        return Response(
            {
                "task_id": task.id,
                "annotation_type": annotation_type,
                "results": [
                    {"label": name, "count": count} for name, count in sorted(counts.items())
                ]
            }
        )
