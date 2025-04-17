import { NextResponse } from 'next/server'

type DiseaseInfo = {
  prevention: string;
  treatment: string;
}

type DiseaseInformation = {
  [key: string]: DiseaseInfo;
}

// Mock disease information for demonstration
// In a real application, this would come from a database or external API
const diseaseInformation: DiseaseInformation = {
  'Black Spot': {
    prevention: `- Keep the area around lemon trees clean from fallen leaves and fruit
- Ensure good air circulation by proper pruning
- Avoid overhead watering, water at the base of the tree
- Use copper-based fungicides preventatively
- Plant resistant varieties where possible
- Apply a layer of mulch to prevent spores from splashing onto the tree
- Rotate crops if possible to break disease cycles`,
    treatment: `- Remove and destroy infected leaves and fruit
- Apply copper-based fungicides or sulfur preparations 
- For organic treatment, use neem oil or potassium bicarbonate
- Apply fungicides every 7-14 days during wet periods
- Implement cultural practices like proper spacing and pruning
- Ensure proper nutrition to strengthen tree's natural defenses
- Consult with a local agricultural extension office for specific recommendations`
  },
  'Greening': {
    prevention: `- Plant certified disease-free trees
- Control Asian citrus psyllid populations with appropriate insecticides
- Regularly inspect trees for early symptoms
- Remove and destroy infected trees immediately
- Maintain tree health with proper nutrition and watering
- Create physical barriers like screenhouses where feasible
- Avoid moving plant material from infected areas`,
    treatment: `- Unfortunately, there is no effective cure for citrus greening once a tree is infected
- Management focuses on slowing disease spread:
  • Remove infected trees to prevent spread to healthy trees
  • Control psyllid populations to prevent transmission
  • Apply enhanced nutrition to extend productive life of mildly infected trees
  • Use antibiotics (where legally permitted) as a temporary management tool
  • Consider replanting with disease-tolerant varieties if available`
  },
  'Healthy': {
    prevention: `- Maintain proper watering schedule - not too much or too little
- Ensure good drainage around the tree
- Regular fertilization with balanced citrus fertilizers
- Annual pruning to maintain tree structure and air circulation
- Inspect regularly for early signs of pests or diseases
- Maintain clean growing area, removing fallen fruit and leaves
- Protect from extreme temperatures and conditions`,
    treatment: `Your lemon tree is healthy! Continue with good care practices:
- Regular balanced fertilization (nitrogen, phosphorus, potassium)
- Proper watering - regular deep watering rather than frequent shallow watering
- Annual pruning for shape and to remove crossing branches
- Foliar sprays can help provide micronutrients
- Add compost annually to improve soil structure
- Monitor for early signs of nutrient deficiencies and correct promptly`
  },
  'Scab': {
    prevention: `- Plant resistant varieties when possible
- Apply copper fungicides at key times: 
  • Just before spring growth 
  • After petal fall
  • 2-3 weeks later
- Maintain good air circulation through proper pruning
- Avoid overhead irrigation that wets the foliage
- Remove fallen leaves and fruit from around trees
- Ensure proper nutrition to strengthen tree's defenses
- Use clean tools when pruning to avoid spreading infection`,
    treatment: `- Apply copper-based fungicides as soon as symptoms appear
- Remove and destroy severely infected leaves and fruit
- Continue applications of fungicide every 10-14 days during wet conditions
- Use horticultural oils to smother fungal spores
- Prune affected areas during dry weather to reduce spread
- Implement proper nutritional program to improve tree vigor
- Rotate fungicides with different modes of action to prevent resistance`
  },
  'Thrips': {
    prevention: `- Maintain healthy trees through proper nutrition and watering
- Encourage beneficial insects like lacewings and predatory mites
- Apply reflective mulch to deter thrips
- Use blue sticky traps to monitor and reduce populations
- Maintain clean growing area, removing weeds that can harbor thrips
- Avoid excessive nitrogen fertilization which can attract thrips
- Apply preventative sprays during flowering periods when risk is highest`,
    treatment: `- Apply insecticidal soap or neem oil for light infestations
- For heavier infestations, use spinosad or other approved insecticides
- Target newly emerging leaves and developing fruit
- Apply treatments in early morning or evening when thrips are most active
- Repeat applications as needed, following product instructions
- Prune and destroy heavily infested plant parts
- Introduce beneficial insects like predatory mites as biological control
- Apply horticultural oil to suffocate thrips and eggs`
  },
  'Đốm Đen': { // Vietnamese translations
    prevention: `- Giữ khu vực xung quanh cây chanh sạch sẽ, không có lá và quả rụng
- Đảm bảo lưu thông không khí tốt bằng cách tỉa cành đúng cách
- Tránh tưới nước từ trên cao, hãy tưới ở gốc cây
- Sử dụng thuốc diệt nấm gốc đồng để phòng ngừa
- Trồng các giống kháng bệnh nếu có thể
- Áp dụng lớp phủ để ngăn bào tử bắn lên cây
- Luân canh cây trồng nếu có thể để phá vỡ chu kỳ bệnh`,
    treatment: `- Loại bỏ và tiêu hủy lá và quả bị nhiễm bệnh
- Áp dụng thuốc diệt nấm gốc đồng hoặc chế phẩm lưu huỳnh
- Đối với phương pháp hữu cơ, sử dụng dầu neem hoặc kali bicarbonate
- Áp dụng thuốc diệt nấm mỗi 7-14 ngày trong thời kỳ ẩm ướt
- Thực hiện các biện pháp canh tác như khoảng cách và tỉa cành phù hợp
- Đảm bảo dinh dưỡng đầy đủ để tăng cường khả năng phòng vệ tự nhiên của cây
- Tham khảo ý kiến của văn phòng khuyến nông địa phương để có khuyến nghị cụ thể`
  },
  'Vàng Lá Greening': {
    prevention: `- Trồng cây được chứng nhận không có bệnh
- Kiểm soát quần thể rầy chổng cánh châu Á bằng thuốc trừ sâu thích hợp
- Thường xuyên kiểm tra cây để phát hiện sớm triệu chứng
- Loại bỏ và tiêu hủy cây bị nhiễm bệnh ngay lập tức
- Duy trì sức khỏe cây với dinh dưỡng và tưới nước phù hợp
- Tạo rào cản vật lý như nhà lưới nếu có thể
- Tránh di chuyển vật liệu thực vật từ khu vực bị nhiễm bệnh`,
    treatment: `- Đáng tiếc, không có phương pháp chữa trị hiệu quả cho bệnh vàng lá một khi cây đã bị nhiễm
- Quản lý tập trung vào việc làm chậm sự lây lan của bệnh:
  • Loại bỏ cây bị nhiễm bệnh để ngăn lây lan sang cây khỏe mạnh
  • Kiểm soát quần thể rầy để ngăn ngừa truyền bệnh
  • Áp dụng dinh dưỡng tăng cường để kéo dài tuổi thọ sản xuất của cây bị nhiễm nhẹ
  • Sử dụng kháng sinh (nơi được phép hợp pháp) như một công cụ quản lý tạm thời
  • Xem xét trồng lại với các giống kháng bệnh nếu có`
  },
  'Khỏe Mạnh': {
    prevention: `- Duy trì lịch tưới nước phù hợp - không quá nhiều hoặc quá ít
- Đảm bảo thoát nước tốt xung quanh cây
- Bón phân đều đặn với phân bón cân bằng cho cây họ cam quýt
- Tỉa cành hàng năm để duy trì cấu trúc cây và lưu thông không khí
- Kiểm tra thường xuyên để phát hiện sớm dấu hiệu của sâu bệnh
- Duy trì khu vực trồng sạch sẽ, loại bỏ quả và lá rụng
- Bảo vệ khỏi nhiệt độ và điều kiện khắc nghiệt`,
    treatment: `Cây chanh của bạn khỏe mạnh! Tiếp tục với các biện pháp chăm sóc tốt:
- Bón phân cân bằng đều đặn (đạm, lân, kali)
- Tưới nước đúng cách - tưới sâu đều đặn thay vì tưới nông thường xuyên
- Tỉa cành hàng năm để tạo hình và loại bỏ các nhánh chéo
- Phun lá có thể giúp cung cấp vi chất dinh dưỡng
- Thêm phân ủ hàng năm để cải thiện cấu trúc đất
- Theo dõi các dấu hiệu sớm của thiếu hụt dinh dưỡng và khắc phục kịp thời`
  },
  'Ghẻ': {
    prevention: `- Trồng các giống kháng bệnh khi có thể
- Áp dụng thuốc diệt nấm đồng vào những thời điểm quan trọng:
  • Ngay trước khi phát triển mùa xuân
  • Sau khi cánh hoa rụng
  • 2-3 tuần sau đó
- Duy trì lưu thông không khí tốt thông qua việc tỉa cành đúng cách
- Tránh tưới từ trên cao làm ướt lá
- Loại bỏ lá và quả rụng xung quanh cây
- Đảm bảo dinh dưỡng phù hợp để tăng cường khả năng phòng vệ của cây
- Sử dụng dụng cụ sạch khi tỉa cành để tránh lây lan nhiễm trùng`,
    treatment: `- Áp dụng thuốc diệt nấm gốc đồng ngay khi xuất hiện triệu chứng
- Loại bỏ và tiêu hủy lá và quả bị nhiễm nặng
- Tiếp tục sử dụng thuốc diệt nấm mỗi 10-14 ngày trong điều kiện ẩm ướt
- Sử dụng dầu làm vườn để làm ngạt bào tử nấm
- Tỉa các khu vực bị ảnh hưởng trong thời tiết khô ráo để giảm sự lây lan
- Thực hiện chương trình dinh dưỡng phù hợp để cải thiện sức sống của cây
- Luân phiên các loại thuốc diệt nấm với các cơ chế hoạt động khác nhau để ngăn ngừa kháng thuốc`
  },
  'Bọ Trĩ': {
    prevention: `- Duy trì cây khỏe mạnh thông qua dinh dưỡng và tưới nước phù hợp
- Khuyến khích côn trùng có lợi như cánh đăng và ve bắt mồi
- Áp dụng lớp phủ phản chiếu để ngăn chặn bọ trĩ
- Sử dụng bẫy dính màu xanh dương để theo dõi và giảm quần thể
- Duy trì khu vực trồng sạch sẽ, loại bỏ cỏ dại có thể chứa bọ trĩ
- Tránh bón phân đạm quá mức có thể thu hút bọ trĩ
- Áp dụng phun phòng ngừa trong thời kỳ ra hoa khi rủi ro cao nhất`,
    treatment: `- Áp dụng xà phòng diệt côn trùng hoặc dầu neem cho nhiễm nhẹ
- Đối với nhiễm nặng hơn, sử dụng spinosad hoặc các loại thuốc trừ sâu được phê duyệt khác
- Nhắm vào lá mới mọc và quả đang phát triển
- Áp dụng các biện pháp vào sáng sớm hoặc buổi tối khi bọ trĩ hoạt động mạnh nhất
- Lặp lại ứng dụng khi cần thiết, theo hướng dẫn sản phẩm
- Tỉa và tiêu hủy các bộ phận thực vật bị nhiễm nặng
- Giới thiệu côn trùng có lợi như ve bắt mồi làm biện pháp kiểm soát sinh học
- Áp dụng dầu làm vườn để làm ngạt bọ trĩ và trứng`
  }
}

export async function POST(request: Request) {
  try {
    const { disease, type } = await request.json()
    
    // Find disease info in English or Vietnamese
    const diseaseInfo = 
      diseaseInformation[disease] || 
      Object.entries(diseaseInformation).find(([key]) => 
        key.toLowerCase() === disease.toLowerCase()
      )?.[1]
    
    if (!diseaseInfo) {
      return NextResponse.json(
        { error: 'Disease information not found' }, 
        { status: 404 }
      )
    }
    
    const information = type === 'prevention' ? diseaseInfo.prevention : diseaseInfo.treatment
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return NextResponse.json({ information })
  } catch (error) {
    console.error('Error processing disease info request:', error)
    return NextResponse.json(
      { error: 'Failed to process request' }, 
      { status: 500 }
    )
  }
} 