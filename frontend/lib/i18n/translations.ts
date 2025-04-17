type TranslationStrings = {
  [key: string]: string;
}

type Languages = {
  [lang: string]: TranslationStrings;
}

export const translations: Languages = {
  en: {
    // App title and navigation
    "app.title": "Lemon Disease Detection",
    "app.upload": "Upload Lemon Fruit Image",
    "app.results": "Analysis Results",
    "app.assistant": "Disease Assistant",
    "app.description": "Advanced AI-powered lemon disease detection and diagnosis platform. Upload images of your lemon plants and get instant disease identification and treatment recommendations.",
    
    // Upload section
    "upload.drag": "Drag and drop or click to upload",
    "upload.supports": "Supports JPG, PNG",
    "upload.analyze": "Analyze Image",
    "upload.analyzing": "Analyzing...",
    
    // Technology section
    "technology.title": "Our Technology",
    "technology.yolo.title": "YOLO Object Detection",
    "technology.yolo.description": "Precise identification of disease-affected areas with bounding boxes using YOLOv8 deep learning model.",
    "technology.efficientnet.title": "EfficientNet Classification",
    "technology.efficientnet.description": "Accurate disease classification using an optimized EfficientNet model trained on thousands of lemon disease images.",
    "technology.gradcam.title": "Grad-CAM Visualization",
    "technology.gradcam.description": "Heatmap visualization showing which parts of the image influenced the AI's decision-making process.",
    
    // Performance metrics
    "performance.title": "AI Performance Metrics",
    "performance.efficientnet.title": "EfficientNet Model Metrics",
    "performance.yolo.title": "YOLO Model Metrics",
    "performance.class": "Class",
    "performance.precision": "Precision",
    "performance.recall": "Recall",
    "performance.f1": "F1-Score",
    "performance.accuracy": "Accuracy",
    "performance.map50.description": "Mean Average Precision at 50% IoU",
    "performance.map50-95.description": "Mean Average Precision across IoUs",
    "performance.precision.description": "True Positives / All Detections",
    "performance.recall.description": "True Positives / All Ground Truths",
    "performance.training.data": "Training Data",
    "performance.training.images": "1,971 Images",
    "performance.training.instances": "2,000 Disease Instances",
    
    // Diseases
    "diseases.blackspot": "Black Spot",
    "diseases.greening": "Greening",
    "diseases.healthy": "Healthy",
    "diseases.scab": "Scab",
    "diseases.thrips": "Thrips",
    
    // CTA section
    "cta.title": "Ready to detect lemon diseases?",
    "cta.description": "Our AI-powered tools will help you quickly identify and treat diseases affecting your lemon plants.",
    
    // Footer
    "footer.credit": "Created by PoPi — Advancing lemon disease detection with AI",

    // Results tabs
    "results.diagnosis": "Diagnosis",
    "results.detection": "Detection",
    "results.heatmap": "Heatmap",
    "results.combined": "Combined",
    
    // Diagnosis details
    "diagnosis.noDetection": "No specific disease areas detected",
    "diagnosis.noDetectionExplanation": "The system could not identify specific disease patterns in this image.",
    "diagnosis.details": "Details:",
    "diagnosis.confidence": "Confidence: {value}%",
    "diagnosis.warning": "Warning:",
    "diagnosis.notAccurate": "No specific disease patterns were detected in this image. The diagnosis may not be accurate.",
    "diagnosis.couldMean": "This could mean:",
    "diagnosis.reason1": "The image doesn't contain any recognizable disease patterns",
    "diagnosis.reason2": "The disease is at an early stage or difficult to detect",
    "diagnosis.reason3": "The image quality or lighting may be affecting analysis",
    "diagnosis.consult": "Consider consulting with a plant pathologist for proper diagnosis.",
    
    // Detection view
    "detection.processing": "Processing detection visualization...",
    "detection.boxes": "Yellow boxes indicate detected disease regions",
    "detection.noAreas": "No specific disease areas detected",
    "detection.noPatterns": "No specific disease patterns detected in this image",
    "detection.areasDetected": "{count} disease area(s) detected",
    
    // Heatmap view
    "heatmap.title": "Grad-CAM Heatmap Visualization",
    "heatmap.explanation": "This visualization highlights the regions that influenced the model's decision",
    "heatmap.generating": "Generating heatmap visualization...",
    "heatmap.redAreas": "Red areas indicate regions that strongly influenced the model's classification decision",
    "heatmap.notAvailable": "Heatmap not available. Click \"Analyze Image\" to generate.",
    
    // Combined view
    "combined.title": "Combined Detection and Heatmap",
    "combined.explanation": "This shows disease areas with targeted heatmap visualization for each detected region",
    "combined.generating": "Generating combined visualization...",
    "combined.boxes": "Yellow boxes show detected regions with heatmap visualization inside each region",
    "combined.notAvailable": "Combined visualization not available. Click \"Analyze Image\" to generate.",
    
    // Chat interface
    "chat.placeholder": "Ask about the detected disease...",
    "chat.analyzeFirst": "Analyze an image first to start chatting",
    "chat.startMessage": "Upload and analyze an image to start chatting about the detected disease",
    "chat.quickQuestions": "Quick Questions",
    "chat.quickQuestion1": "What are the symptoms of {disease}?",
    "chat.quickQuestion2": "How can I treat {disease}?",
    "chat.quickQuestion3": "How does {disease} spread?",
    "chat.quickQuestion4": "How can I prevent {disease}?",
    "chat.quickQuestion1Button": "Symptoms",
    "chat.quickQuestion2Button": "Treatment",
    "chat.quickQuestion3Button": "Transmission",
    "chat.quickQuestion4Button": "Prevention",
    
    // No results state
    "results.none": "Upload and analyze a lemon leaf image to see results",
    
    // Language selector
    "language.en": "English",
    "language.vi": "Tiếng Việt",
    
    // Export
    "export.pdf": "Export as PDF",
    "export.title": "Disease Analysis Report",
    "export.date": "Analysis Date: {date}",
    "export.print": "Print Report",
    
    // Disease treatment and prevention
    "diseases.prevention": "Prevention",
    "diseases.treatment": "Treatment",
    "diseases.preventionFor": "Prevention for {disease}",
    "diseases.treatmentFor": "Treatment for {disease}",
    "diseases.fallbackPrevention": "Please ensure your plants have good air circulation, avoid overhead watering, practice good garden hygiene, and consider using preventative fungicides or organic alternatives when appropriate.",
    "diseases.fallbackTreatment": "Consult with a local agricultural expert for specific treatment guidance. General approaches include removing infected parts, applying appropriate treatments, and ensuring optimal growing conditions."
  },
  vi: {
    // App title and navigation
    "app.title": "Phát Hiện Bệnh Chanh",
    "app.upload": "Tải Lên Hình Ảnh Chanh",
    "app.results": "Kết Quả Phân Tích",
    "app.assistant": "Trợ Lý Bệnh",
    "app.description": "Nền tảng phát hiện và chẩn đoán bệnh chanh được hỗ trợ bởi AI tiên tiến. Tải lên hình ảnh cây chanh của bạn và nhận kết quả nhận dạng bệnh và khuyến nghị điều trị ngay lập tức.",
    
    // Upload section
    "upload.drag": "Kéo thả hoặc nhấp để tải lên",
    "upload.supports": "Hỗ trợ JPG, PNG",
    "upload.analyze": "Phân Tích Hình Ảnh",
    "upload.analyzing": "Đang phân tích...",
    
    // Technology section
    "technology.title": "Công Nghệ Của Chúng Tôi",
    "technology.yolo.title": "Phát Hiện Đối Tượng YOLO",
    "technology.yolo.description": "Nhận dạng chính xác các vùng bị ảnh hưởng bởi bệnh với các khung bounding box sử dụng mô hình học sâu YOLOv8.",
    "technology.efficientnet.title": "Phân Loại EfficientNet",
    "technology.efficientnet.description": "Phân loại bệnh chính xác bằng mô hình EfficientNet được tối ưu hóa, được đào tạo trên hàng nghìn hình ảnh bệnh chanh.",
    "technology.gradcam.title": "Biểu Đồ Grad-CAM",
    "technology.gradcam.description": "Biểu đồ nhiệt hiển thị những phần của hình ảnh đã ảnh hưởng đến quá trình ra quyết định của AI.",
    
    // Performance metrics
    "performance.title": "Chỉ Số Hiệu Suất AI",
    "performance.efficientnet.title": "Chỉ Số Mô Hình EfficientNet",
    "performance.yolo.title": "Chỉ Số Mô Hình YOLO",
    "performance.class": "Lớp",
    "performance.precision": "Độ Chính Xác",
    "performance.recall": "Độ Thu Hồi",
    "performance.f1": "Điểm F1",
    "performance.accuracy": "Độ Chính Xác",
    "performance.map50.description": "Độ Chính Xác Trung Bình ở 50% IoU",
    "performance.map50-95.description": "Độ Chính Xác Trung Bình trên các IoU",
    "performance.precision.description": "True Positives / Tất Cả Phát Hiện",
    "performance.recall.description": "True Positives / Tất Cả Ground Truths",
    "performance.training.data": "Dữ Liệu Đào Tạo",
    "performance.training.images": "1.971 Hình Ảnh",
    "performance.training.instances": "2.000 Trường Hợp Bệnh",
    
    // Diseases
    "diseases.blackspot": "Đốm Đen",
    "diseases.greening": "Vàng Lá Greening",
    "diseases.healthy": "Khỏe Mạnh",
    "diseases.scab": "Ghẻ",
    "diseases.thrips": "Bọ Trĩ",
    
    // CTA section
    "cta.title": "Sẵn sàng phát hiện bệnh chanh?",
    "cta.description": "Các công cụ được hỗ trợ bởi AI của chúng tôi sẽ giúp bạn nhanh chóng xác định và điều trị các bệnh ảnh hưởng đến cây chanh của bạn.",
    
    // Footer
    "footer.credit": "Được tạo bởi PoPi — Phát triển phát hiện bệnh chanh với AI",
    
    // Results tabs
    "results.diagnosis": "Chẩn Đoán",
    "results.detection": "Phát Hiện",
    "results.heatmap": "Bản Đồ Nhiệt",
    "results.combined": "Kết Hợp",
    
    // Diagnosis details
    "diagnosis.noDetection": "Không phát hiện vùng bệnh cụ thể",
    "diagnosis.noDetectionExplanation": "Hệ thống không thể xác định các mẫu bệnh cụ thể trong hình ảnh này.",
    "diagnosis.details": "Chi tiết:",
    "diagnosis.confidence": "Độ tin cậy: {value}%",
    "diagnosis.warning": "Cảnh báo:",
    "diagnosis.notAccurate": "Không phát hiện thấy các dấu hiệu bệnh cụ thể trong ảnh này. Chẩn đoán có thể không chính xác.",
    "diagnosis.couldMean": "Điều này có thể có nghĩa:",
    "diagnosis.reason1": "Hình ảnh không chứa các dấu hiệu bệnh nhận biết được",
    "diagnosis.reason2": "Bệnh đang ở giai đoạn đầu hoặc khó phát hiện",
    "diagnosis.reason3": "Chất lượng hình ảnh hoặc ánh sáng có thể ảnh hưởng đến phân tích",
    "diagnosis.consult": "Hãy tham khảo ý kiến của chuyên gia bệnh học thực vật để có chẩn đoán chính xác.",
    
    // Detection view
    "detection.processing": "Đang xử lý hình ảnh phát hiện...",
    "detection.boxes": "Các ô màu vàng chỉ ra vùng bệnh được phát hiện",
    "detection.noAreas": "Không phát hiện vùng bệnh cụ thể",
    "detection.noPatterns": "Không phát hiện thấy các dấu hiệu bệnh cụ thể trong ảnh này",
    "detection.areasDetected": "Đã phát hiện {count} vùng bệnh",
    
    // Heatmap view
    "heatmap.title": "Biểu Đồ Nhiệt Grad-CAM",
    "heatmap.explanation": "Hình ảnh này làm nổi bật các vùng đã ảnh hưởng đến quyết định của mô hình",
    "heatmap.generating": "Đang tạo biểu đồ nhiệt...",
    "heatmap.redAreas": "Các vùng màu đỏ chỉ ra những vùng ảnh hưởng mạnh đến quyết định phân loại của mô hình",
    "heatmap.notAvailable": "Biểu đồ nhiệt không khả dụng. Nhấp \"Phân Tích Hình Ảnh\" để tạo.",
    
    // Combined view
    "combined.title": "Kết Hợp Phát Hiện và Biểu Đồ Nhiệt",
    "combined.explanation": "Hiển thị các vùng bệnh với biểu đồ nhiệt mục tiêu cho từng vùng phát hiện",
    "combined.generating": "Đang tạo hình ảnh kết hợp...",
    "combined.boxes": "Các ô màu vàng hiển thị các vùng phát hiện với biểu đồ nhiệt bên trong mỗi vùng",
    "combined.notAvailable": "Hình ảnh kết hợp không khả dụng. Nhấp \"Phân Tích Hình Ảnh\" để tạo.",
    
    // Chat interface
    "chat.placeholder": "Hỏi về bệnh được phát hiện...",
    "chat.analyzeFirst": "Phân tích hình ảnh trước để bắt đầu trò chuyện",
    "chat.startMessage": "Tải lên và phân tích hình ảnh để bắt đầu trò chuyện về bệnh được phát hiện",
    "chat.quickQuestions": "Câu Hỏi Nhanh",
    "chat.quickQuestion1": "Triệu chứng của {disease} là gì?",
    "chat.quickQuestion2": "Làm thế nào để điều trị {disease}?",
    "chat.quickQuestion3": "Làm thế nào {disease} lây lan?",
    "chat.quickQuestion4": "Làm thế nào để ngăn ngừa {disease}?",
    "chat.quickQuestion1Button": "Triệu chứng",
    "chat.quickQuestion2Button": "Điều trị",
    "chat.quickQuestion3Button": "Lây lan",
    "chat.quickQuestion4Button": "Phòng ngừa",
    
    // No results state
    "results.none": "Tải lên và phân tích hình ảnh lá chanh để xem kết quả",
    
    // Language selector
    "language.en": "English",
    "language.vi": "Tiếng Việt",
    
    // Export
    "export.pdf": "Xuất dạng PDF",
    "export.title": "Báo Cáo Phân Tích Bệnh",
    "export.date": "Ngày phân tích: {date}",
    "export.print": "In Báo Cáo",
    
    // Disease treatment and prevention
    "diseases.prevention": "Phòng Ngừa",
    "diseases.treatment": "Điều Trị",
    "diseases.preventionFor": "Phòng ngừa {disease}",
    "diseases.treatmentFor": "Điều trị {disease}",
    "diseases.fallbackPrevention": "Hãy đảm bảo cây trồng của bạn có sự lưu thông không khí tốt, tránh tưới nước từ trên cao, thực hiện vệ sinh vườn tốt và cân nhắc sử dụng thuốc diệt nấm phòng ngừa hoặc các giải pháp hữu cơ thay thế khi thích hợp.",
    "diseases.fallbackTreatment": "Tham khảo ý kiến chuyên gia nông nghiệp địa phương để được hướng dẫn điều trị cụ thể. Các phương pháp tiếp cận chung bao gồm loại bỏ các bộ phận bị nhiễm bệnh, áp dụng các biện pháp điều trị thích hợp và đảm bảo điều kiện phát triển tối ưu."
  }
}; 