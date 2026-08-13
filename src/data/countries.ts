export interface CountryData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  flag: string;
  description?: string;
  language?: string;
  cuisine?: string;
  costume?: string;
  festival?: string;
}

export const countries: CountryData[] = [
  { 
    id: 'JP', name: 'Nhật Bản', lat: 36.2048, lng: 138.2529, flag: '🇯🇵', 
    description: 'Xứ sở hoa anh đào nổi tiếng với tinh thần võ sĩ đạo, sự giao thoa độc đáo giữa truyền thống và công nghệ hiện đại.',
    language: 'Tiếng Nhật', cuisine: 'Sushi, Sashimi, Ramen', costume: 'Kimono, Yukata', festival: 'Lễ hội hoa anh đào (Hanami)' 
  },
  { 
    id: 'RU', name: 'Nga', lat: 61.5240, lng: 105.3188, flag: '🇷🇺', 
    description: 'Quốc gia rộng lớn nhất thế giới, mang đậm dấu ấn văn hóa với búp bê Matryoshka, điệu múa dân gian và kiến trúc lộng lẫy.',
    language: 'Tiếng Nga', cuisine: 'Súp Borscht, Bánh Pelmeni', costume: 'Sarafan, Kokoshnik', festival: 'Lễ hội tiễn mùa đông Maslenitsa' 
  },
  { 
    id: 'NG', name: 'Ni-giê-ri-a', lat: 9.0820, lng: 8.6753, flag: '🇳🇬', 
    description: 'Trái tim của châu Phi với hơn 250 bộ tộc, nổi bật với nền ẩm thực phong phú và những lễ hội hóa trang rực rỡ sắc màu.',
    language: 'Tiếng Anh, Hausa, Yoruba, Igbo', cuisine: 'Cơm Jollof, Súp Egusi', costume: 'Agbada, Buba', festival: 'Lễ hội đánh bắt cá Argungu' 
  },
  { 
    id: 'VN', name: 'Việt Nam', lat: 14.0583, lng: 108.2772, flag: '🇻🇳', 
    description: 'Đất nước hình chữ S với bề dày lịch sử 4000 năm, nổi tiếng với áo dài truyền thống và nền ẩm thực nức lòng bạn bè quốc tế.',
    language: 'Tiếng Việt', cuisine: 'Phở, Bánh mì, Gỏi cuốn', costume: 'Áo dài, Áo tứ thân', festival: 'Tết Nguyên Đán, Giỗ Tổ Hùng Vương' 
  },
  { 
    id: 'IN', name: 'Ấn Độ', lat: 20.5937, lng: 78.9629, flag: '🇮🇳', 
    description: 'Cái nôi của những tôn giáo lớn, quyến rũ với trang phục Sari, đền Taj Mahal và nền điện ảnh Bollywood sôi động.',
    language: 'Tiếng Hindi, Tiếng Anh', cuisine: 'Cà ri, Bánh Naan, Gà Tandoori', costume: 'Sari, Dhoti', festival: 'Lễ hội ánh sáng Diwali, Lễ hội sắc màu Holi' 
  },
  { 
    id: 'US', name: 'Hoa Kỳ', lat: 37.0902, lng: -95.7129, flag: '🇺🇸', 
    description: 'Quốc gia đa văn hóa được mệnh danh là "nồi lẩu thập cẩm", hội tụ tinh hoa từ khắp nơi trên thế giới.',
    language: 'Tiếng Anh', cuisine: 'Hamburger, Hot dog, Bánh táo', costume: 'Đa dạng, tự do, trang phục cao bồi', festival: 'Lễ Tạ Ơn (Thanksgiving), Quốc khánh 4/7' 
  },
  { 
    id: 'KR', name: 'Hàn Quốc', lat: 35.9078, lng: 127.7669, flag: '🇰🇷', 
    description: 'Xứ sở kim chi năng động, nơi làn sóng Hallyu (K-Pop, K-Drama) kết hợp hài hòa cùng văn hóa Hanbok truyền thống.',
    language: 'Tiếng Hàn', cuisine: 'Kim chi, Bibimbap, Kimbap', costume: 'Hanbok', festival: 'Tết Trung Thu (Chuseok)' 
  },
  { 
    id: 'TH', name: 'Thái Lan', lat: 15.8700, lng: 100.9925, flag: '🇹🇭', 
    description: 'Đất nước của những nụ cười và những ngôi chùa vàng rực rỡ, hấp dẫn với lễ hội té nước Songkran độc đáo.',
    language: 'Tiếng Thái', cuisine: 'Pad Thái, Tom Yum', costume: 'Chut Thai', festival: 'Lễ hội té nước Songkran, Lễ hội đèn lồng Loy Krathong' 
  },
  { 
    id: 'CN', name: 'Trung Quốc', lat: 35.8617, lng: 104.1954, flag: '🇨🇳', 
    description: 'Nền văn minh rực rỡ lâu đời, quê hương của Vạn Lý Trường Thành, Kinh Kịch và nghệ thuật Trà Đạo tinh tế.',
    language: 'Tiếng Trung', cuisine: 'Vịt quay Bắc Kinh, Sủi cảo, Dimsum', costume: 'Sườn xám, Hán phục', festival: 'Tết Nguyên Đán, Lễ hội đèn lồng' 
  },
  { 
    id: 'MN', name: 'Mông Cổ', lat: 46.8625, lng: 103.8467, flag: '🇲🇳', 
    description: 'Vùng đất của những thảo nguyên bao la, nơi lưu giữ nếp sống du mục tự do trên lưng ngựa qua hàng thế kỷ.',
    language: 'Tiếng Mông Cổ', cuisine: 'Thịt cừu nướng, Sữa ngựa lên men (Airag)', costume: 'Deel (áo choàng)', festival: 'Lễ hội Naadam (Vật, đua ngựa, bắn cung)' 
  },
  { 
    id: 'FR', name: 'Pháp', lat: 46.2276, lng: 2.2137, flag: '🇫🇷', 
    description: 'Kinh đô ánh sáng hoa lệ, cái nôi của nghệ thuật, thời trang cao cấp và nền ẩm thực tinh tế bậc nhất thế giới.',
    language: 'Tiếng Pháp', cuisine: 'Bánh mì Baguette, Phô mai, Rượu vang', costume: 'Áo sọc Breton, Mũ Beret', festival: 'Quốc khánh Pháp (Bastille Day)' 
  },
  { 
    id: 'IT', name: 'Ý', lat: 41.8719, lng: 12.5674, flag: '🇮🇹', 
    description: 'Đất nước hình chiếc ủng với những di sản Phục Hưng vô giá, nổi tiếng toàn cầu về nghệ thuật, pizza và pasta.',
    language: 'Tiếng Ý', cuisine: 'Pizza, Pasta, Gelato', costume: 'Trang phục La Mã (lịch sử), Thời trang hiện đại Milan', festival: 'Lễ hội hóa trang Venice' 
  },
];
