import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from "dotenv";
dotenv.config();

// ─── Schemas ────────────────────────────────────────────────────────────────

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: {
    type: String,
    required: function () { return this.provider === 'local'; },
  },
  googleId: { type: String, unique: true, sparse: true },
  provider: { type: String, enum: ['local', 'google'], default: 'local' },
  bio: { type: String, maxlength: 160, default: '' },
  profileImage: { type: String, default: null },
  urls: [{ value: String }],
}, { timestamps: true });

const diarySchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 200 },
  content: { type: String, required: true },
  isPublic: { type: Boolean, default: false },
  allowComments: { type: Boolean, default: true },
  selectedMood: { type: String, enum: ['stressed', 'okay', 'calm', 'happy', 'great'], default: 'happy' },
  tags: { type: [String], default: [] },
  coverPhoto: { type: String, default: null },
  isDraft: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  likesCount: { type: Number, default: 0 },
}, { timestamps: true });

const commentSchema = new mongoose.Schema({
  content: { type: String, required: true, trim: true, maxlength: 500 },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  diaryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Diary', required: true },
}, { timestamps: true });

const User    = mongoose.model('User',    userSchema);
const Diary   = mongoose.model('Diary',   diarySchema);
const Comment = mongoose.model('Comment', commentSchema);

// ─── Helpers ─────────────────────────────────────────────────────────────────

const rng = (arr) => arr[Math.floor(Math.random() * arr.length)];
const rngMany = (arr, n) => [...arr].sort(() => Math.random() - 0.5).slice(0, n);
const rngInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

/** Tạo ngày ngẫu nhiên trong khoảng [daysAgo, 0] ngày trước */
const rngDate = (daysAgo = 180) => {
  const d = new Date();
  d.setDate(d.getDate() - rngInt(0, daysAgo));
  d.setHours(rngInt(0, 23), rngInt(0, 59), rngInt(0, 59));
  return d;
};

const buildHtml = (paragraphs) =>
  paragraphs.map(p => `<p class="lexkit-paragraph"><span style="white-space: pre-wrap;">${p}</span></p>`).join('\n');

// ─── Dữ liệu tiếng Việt ──────────────────────────────────────────────────────

const MOODS = ['stressed', 'okay', 'calm', 'happy', 'great'];

const ALL_TAGS = [
  'cuộc-sống', 'gia-đình', 'bạn-bè', 'tình-yêu', 'học-tập',
  'công-việc', 'sức-khỏe', 'du-lịch', 'ẩm-thực', 'âm-nhạc',
  'phim-ảnh', 'sách', 'thể-thao', 'thiên-nhiên', 'hồi-ký',
  'cảm-xúc', 'trưởng-thành', 'ước-mơ', 'kỷ-niệm', 'tâm-sự',
];

const COVER_PHOTOS = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
  'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800',
  'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800',
  'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800',
  'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=800',
  null, null, null, // một số bài không có ảnh bìa
];

/** 30 bộ nội dung nhật ký tiếng Việt */
const DIARY_TEMPLATES = [
  {
    title: 'Buổi sáng đầu tuần',
    paragraphs: [
      'Hôm nay thức dậy lúc 6 giờ sáng, bầu trời Hà Nội còn mờ sương. Tách cà phê trên tay, tôi ngồi nhìn ra cửa sổ và cảm thấy một ngày mới đang bắt đầu rất chậm rãi, dịu dàng.',
      'Mấy tuần gần đây tôi cố gắng dậy sớm hơn để có thêm thời gian cho bản thân trước khi bắt đầu làm việc. Cảm giác yên tĩnh vào buổi sáng thực sự khác biệt hoàn toàn so với những ngày cuống cuồng vào văn phòng.',
      'Hy vọng tuần này mọi thứ sẽ suôn sẻ hơn tuần trước.',
    ],
  },
  {
    title: 'Chuyến đi Đà Lạt bất ngờ',
    paragraphs: [
      'Bạn thân gọi điện lúc 9 giờ tối hỏi: "Mày có muốn đi Đà Lạt sáng mai không?" Và tôi đã nói có, không cần suy nghĩ.',
      'Chúng tôi đặt vé xe ngay trong đêm. 5 giờ sáng hôm sau đã có mặt tại bến xe Miền Đông, người chưa tỉnh hẳn nhưng lòng thì phấn khích lạ thường.',
      'Đà Lạt mùa này se lạnh, hoa dã quỳ nở vàng rực dọc đường. Đây là một trong những chuyến đi ý nghĩa nhất năm của tôi.',
    ],
  },
  {
    title: 'Nấu ăn một mình',
    paragraphs: [
      'Tối nay tôi tự nấu bữa tối cho lần đầu tiên kể từ khi chuyển ra ở riêng. Thực đơn: canh chua cá lóc và thịt kho tàu — hai món mẹ hay nấu.',
      'Canh thì hơi thiếu me, thịt thì hơi ngọt quá tay. Nhưng ngồi ăn một mình trong căn phòng nhỏ, tôi vẫn cảm thấy ấm lòng theo cách riêng của nó.',
      'Có lẽ tôi sẽ gọi điện cho mẹ hỏi công thức vào cuối tuần này.',
    ],
  },
  {
    title: 'Ngày mưa dài',
    paragraphs: [
      'Hà Nội mưa từ sáng đến tận 10 giờ đêm. Tôi ở nhà gần như cả ngày, đọc sách và nghe nhạc. Một ngày "lãng phí" theo nghĩa thông thường nhưng lại đầy đủ theo nghĩa khác.',
      'Cuốn sách tôi đang đọc là "Cây cam ngọt của tôi" — đọc lần thứ ba rồi mà vẫn không tránh khỏi chỗ nức nở ở chương cuối.',
      'Những ngày mưa như thế này tôi hay nhớ đến tuổi thơ, nhớ con đường đất trước nhà sau mỗi cơn mưa lớn.',
    ],
  },
  {
    title: 'Buổi phỏng vấn hôm nay',
    paragraphs: [
      'Vừa kết thúc buổi phỏng vấn cho vị trí mới. Câu hỏi kỹ thuật không quá khó, nhưng tôi vẫn bị hỏng ở một bài system design vì hồi hộp quá.',
      'Nhà tuyển dụng nói sẽ phản hồi trong vòng một tuần. Tôi không biết mình có nên hy vọng nhiều không.',
      'Dù kết quả thế nào, trải nghiệm này cũng dạy cho tôi biết mình cần học thêm gì. Sẽ ôn lại distributed systems tối nay.',
    ],
  },
  {
    title: 'Kỷ niệm ngày ra trường',
    paragraphs: [
      'Hôm nay đúng 2 năm ngày tôi nhận bằng tốt nghiệp. Nhìn lại bức ảnh mặc lễ phục, tôi vừa buồn cười vừa xúc động.',
      '2 năm không phải là quá dài, nhưng tôi của ngày hôm nay đã khác rất nhiều so với cậu sinh viên ngơ ngác hồi đó.',
      'Cảm ơn những va vấp, những đêm thức đến sáng để debug, những lần bị sếp nhắc nhở. Tất cả đều là bài học.',
    ],
  },
  {
    title: 'Tản bộ quanh Hồ Tây',
    paragraphs: [
      'Chiều nay tôi đi bộ một vòng quanh Hồ Tây — khoảng 17km, mất gần 3 tiếng đồng hồ. Lần đầu tiên làm vậy và thấy thực sự thích.',
      'Hoàng hôn trên mặt hồ rất đẹp. Ánh nắng cuối ngày loang loáng trên mặt nước, mấy chiếc thuyền kayak lướt qua. Tôi đứng một lúc lâu mà không muốn đi.',
      'Hà Nội đẹp nhất vào những lúc tôi không vội vã.',
    ],
  },
  {
    title: 'Đọc xong cuốn sách đầu tiên của năm',
    paragraphs: [
      'Vừa đọc xong "Sapiens: Lược sử loài người". Mất 3 tuần đọc on-and-off nhưng đáng từng trang.',
      'Phần tôi ấn tượng nhất là chương bàn về các "thực thể tưởng tượng" — tiền, quốc gia, công ty — và cách chúng định hình xã hội loài người. Một góc nhìn khiến tôi phải dừng lại suy nghĩ nhiều lần.',
      'Cuốn tiếp theo trong list đọc: "21 bài học cho thế kỷ 21" của cùng tác giả.',
    ],
  },
  {
    title: 'Lần đầu học nấu phở',
    paragraphs: [
      'Cuối tuần này tôi thử thách bản thân nấu một nồi phở bò từ đầu. Nước dùng hầm từ 8 giờ sáng, ninh xương ống với gừng nướng và hành tây than.',
      'Kết quả: nước dùng trong và ngọt hơn tôi tưởng, nhưng thiếu mùi hồi. Lần sau sẽ thêm đúng lượng hoa hồi hơn.',
      'Mời mấy đứa bạn qua ăn. Cả bọn khen ngon dù tôi biết còn xa mới bằng phở ngoài hàng. Nhưng tự làm vẫn vui hơn nhiều.',
    ],
  },
  {
    title: 'Cuộc trò chuyện với ba',
    paragraphs: [
      'Tối nay ba gọi điện hỏi thăm, chúng tôi nói chuyện gần một tiếng — lâu nhất từ trước đến giờ. Ba hỏi về công việc, về cuộc sống ở Hà Nội. Tôi hỏi ba về vườn rau sau nhà.',
      'Ba bảo năm nay sẽ trồng thêm mướp và bầu. Tôi nghe mà tự nhiên muốn về nhà lắm.',
      'Hứa với bản thân sẽ về thăm nhà trước khi hè kết thúc.',
    ],
  },
  {
    title: 'Ngày tự thưởng bản thân',
    paragraphs: [
      'Sau một tháng làm việc liên tục không nghỉ, hôm nay tôi quyết định nghỉ cả ngày — không email, không Slack, không mở laptop.',
      'Buổi sáng ngủ đến 9 giờ. Buổi chiều xem phim. Buổi tối đi ăn bún bò Huế ở quán quen rồi uống trà sữa tráng miệng.',
      'Ai đó từng nói nghỉ ngơi là một kỹ năng. Tôi đang tập kỹ năng đó.',
    ],
  },
  {
    title: 'Tuần đầu tiên tập gym',
    paragraphs: [
      'Đăng ký phòng gym được 1 tuần rồi. 5/7 buổi đi đúng kế hoạch — tốt hơn tôi nghĩ.',
      'Người đau mỏi hết sức, nhất là ngày sau leg day. Leo cầu thang lên tầng 3 mà phải vịn tường.',
      'Nhưng ngủ ngon hơn hẳn, đầu óc cũng thanh thản hơn sau mỗi buổi tập. Sẽ cố duy trì ít nhất 3 tháng.',
    ],
  },
  {
    title: 'Concert đầu tiên sau dịch',
    paragraphs: [
      'Đêm qua tôi đi xem concert của một ban nhạc indie mà tôi đã follow từ hồi đại học. Lần đầu tiên được nghe live sau mấy năm.',
      'Cảm giác đứng giữa đám đông, loa bass rung trong ngực, ánh đèn sân khấu lóa mắt — không có gì thay thế được.',
      'Họ chơi bài "Mưa Trên Phố Huế" lúc cuối. Tôi hát theo và thấy mình trẻ lại 5 tuổi.',
    ],
  },
  {
    title: 'Deadline và những ly cà phê',
    paragraphs: [
      'Hôm nay là ngày deadline sprint. Tôi uống 4 ly cà phê, ăn mì gói lúc 11 giờ đêm và push code lên lúc 1 giờ sáng.',
      'PR pass review, feature lên production không có lỗi. Cái cảm giác nhẹ nhõm sau khi deploy thành công không có gì tả được.',
      'Ngày mai sẽ ngủ bù. Nhưng tối nay vẫn phải review nốt cái PR còn lại của đồng nghiệp.',
    ],
  },
  {
    title: 'Gặp lại người bạn cũ',
    paragraphs: [
      'Tình cờ gặp lại Minh — bạn cùng lớp cấp 3 — ở siêu thị. Hai đứa đứng nói chuyện gần 30 phút giữa khu đồ ăn.',
      'Minh bây giờ đang làm kế toán, có con nhỏ 2 tuổi. Cuộc sống mỗi người mỗi hướng, nhưng nói chuyện vẫn tự nhiên như hồi xưa.',
      'Chúng tôi hứa sẽ tổ chức một buổi họp lớp cuối năm. Hy vọng lần này không bị hủy như mọi năm.',
    ],
  },
  {
    title: 'Lần đầu trình bày trước công ty',
    paragraphs: [
      'Hôm nay tôi thuyết trình về kiến trúc hệ thống mới trước toàn bộ team engineering — khoảng 30 người.',
      'Chuẩn bị slide từ mấy ngày trước, nhưng khi đứng lên thì vẫn run tay. May mắn là câu hỏi Q&A không có gì quá bất ngờ.',
      'Sếp khen là "clear và súc tích". Tôi về chỗ ngồi mà tim vẫn còn đập nhanh một lúc lâu.',
    ],
  },
  {
    title: 'Những điều nhỏ làm tôi vui hôm nay',
    paragraphs: [
      'Một bé chó Phốc Sóc chạy vào thang máy cùng tôi rồi không chịu ra. Chủ nó phải bế nó ra, cả hành lang cười.',
      'Anh bán bánh mì góc phố tặng thêm miếng chả lụa vì hôm nay là ngày sinh nhật tôi — dù tôi không nói gì.',
      'Build CI xanh lần đầu không cần fix gì thêm. Mấy điều nhỏ thôi nhưng cộng lại thành một ngày khá tốt.',
    ],
  },
  {
    title: 'Tự học thêm điều mới',
    paragraphs: [
      'Tuần này tôi bắt đầu học Docker và container orchestration. Khởi đầu bằng chuỗi tutorial trên YouTube rồi thực hành với dự án side project.',
      'Lần đầu chạy docker-compose up mà thấy tất cả services start thành công là cái cảm giác rất thỏa mãn.',
      'Mục tiêu của tháng này: deploy được một ứng dụng nhỏ lên VPS bằng Docker. Đang đi đúng hướng rồi.',
    ],
  },
  {
    title: 'Ngày cuối tuần ở nhà',
    paragraphs: [
      'Không đi đâu cả ngày. Dọn dẹp phòng, giặt đồ, tua lại series "Squid Game" mùa 2 trong lúc gấp quần áo.',
      'Buổi chiều pha trà, ngồi đọc sách ở ban công. Hàng xóm phía dưới đang nướng gì đó thơm lắm.',
      'Những ngày "không làm gì" như thế này tôi thấy mình nạp năng lượng tốt hơn bất kỳ kỳ nghỉ nào.',
    ],
  },
  {
    title: 'Nhớ về mùa hè năm 18 tuổi',
    paragraphs: [
      'Hôm nay nghe lại playlist nhạc năm lớp 12 — Westlife, Backstreet Boys, và vài bài V-Pop cũ. Ký ức ùa về ngay lập tức.',
      'Mùa hè năm đó: ôn thi đại học ban ngày, tối đi chơi với bạn bè đến 10 giờ, về nhà ăn mì tôm và ngủ thiếp đi trên bàn học.',
      'Không biết tại sao tuổi trẻ lại vừa mệt mỏi vừa đẹp đến vậy.',
    ],
  },
  {
    title: 'Chạy bộ buổi sáng — ngày 30',
    paragraphs: [
      'Hôm nay đánh dấu 30 ngày chạy bộ liên tục. Mỗi sáng ít nhất 3km, đôi khi 5km nếu dậy sớm đủ.',
      'Ban đầu thở không nổi đến km thứ 2. Bây giờ km thứ 3 mới bắt đầu cảm thấy nặng. Tiến bộ rõ rệt.',
      'Mục tiêu tháng tới: tham gia giải 5km tổ chức cuối tháng. Run for fun thôi, không phải giải nhất nhì gì.',
    ],
  },
  {
    title: 'Lá thư gửi bản thân năm ngoái',
    paragraphs: [
      'Hôm qua tôi tình cờ đọc lại nhật ký năm ngoái. Tôi của một năm trước lo lắng rất nhiều về những điều mà tôi bây giờ đã vượt qua rồi.',
      'Bạn ơi — tôi của năm ngoái — mọi thứ rồi cũng ổn. Công việc, tình cảm, sức khỏe — tất cả đều đang tốt hơn bạn nghĩ.',
      'Tôi hy vọng tôi của năm sau khi đọc lại bài này cũng thấy như vậy.',
    ],
  },
  {
    title: 'Ăn sáng một mình ở quán quen',
    paragraphs: [
      'Quán bún riêu ở đầu phố mở cửa lại sau cả tháng sửa chữa. Sáng nay tôi ra ăn — vẫn ngon y như cũ, chị chủ quán vẫn nhớ tôi hay ăn thêm ốc.',
      'Những buổi sáng ăn một mình như thế này tôi hay quan sát xung quanh: ông cụ đọc báo giấy, mấy đứa học sinh ăn vội trước giờ vào lớp, cô nhân viên văn phòng tranh thủ gọi điện.',
      'Cuộc sống vẫn đang diễn ra, bình thường và đẹp đẽ theo cách riêng của nó.',
    ],
  },
  {
    title: 'Học ngoại ngữ mới',
    paragraphs: [
      'Tháng này tôi bắt đầu học tiếng Nhật từ đầu — chỉ vì muốn xem anime không cần sub. Lý do nghe có vẻ không nghiêm túc nhưng thực ra là động lực rất thực.',
      'Tuần đầu: học Hiragana và Katakana. Não già rồi nên nhớ chậm hơn hồi còn học sinh, nhưng vẫn tiến được.',
      'Streak trên Duolingo đang là 14 ngày. Cố giữ đến hết tháng.',
    ],
  },
  {
    title: 'Hôm nay tôi xin lỗi',
    paragraphs: [
      'Tuần trước tôi đã nói nặng lời với đồng nghiệp trong một buổi họp căng thẳng. Sai hoàn toàn về cách ứng xử, dù tranh luận về kỹ thuật đúng hay sai thế nào đi nữa.',
      'Hôm nay tôi nhắn tin xin lỗi trực tiếp. Bạn ấy bảo không sao, nhưng tôi vẫn cảm thấy không thoải mái với bản thân.',
      'Ghi lại đây để nhớ: không bao giờ để áp lực công việc khiến mình mất bình tĩnh với người khác.',
    ],
  },
  {
    title: 'Triển lãm ảnh cuối tuần',
    paragraphs: [
      'Cuối tuần này có triển lãm ảnh ở Trung tâm Văn hóa Pháp — chủ đề về Hà Nội thập niên 80-90. Tôi đi một mình và ở lại gần 2 tiếng.',
      'Những bức ảnh đen trắng chụp phố cổ, chợ, xe đạp, áo dài... Hà Nội trong ký ức của những người không thuộc thế hệ tôi nhưng vẫn gợi lên cảm giác thân thuộc.',
      'Mua về một tấm poster nhỏ làm kỷ niệm. Dán lên tường bên cạnh bàn làm việc.',
    ],
  },
  {
    title: 'Viết về nỗi sợ thất bại',
    paragraphs: [
      'Gần đây tôi nhận ra mình hay trì hoãn vì sợ làm không đủ tốt. Thà không làm còn hơn làm rồi thất bại.',
      'Nhưng cứ không làm thì mãi không đến đâu. Cuốn sách chưa viết, dự án chưa bắt đầu, bài nhạc chưa chơi xong — tất cả đang nằm trong đầu.',
      'Hôm nay tôi mở file code dự án side project đã để im 3 tháng và viết thêm 50 dòng. Nhỏ thôi nhưng quan trọng là đã bắt đầu lại.',
    ],
  },
  {
    title: 'Chiều mưa Sài Gòn',
    paragraphs: [
      'Công tác vào TP.HCM 3 ngày. Chiều nay mưa như trút nước đúng lúc tôi ra khỏi văn phòng — may mắn có mái hiên trú.',
      'Người Sài Gòn quen mưa rồi, ai nấy vẫn chạy xe bình thường trong mưa, không khác gì nắng.',
      'Uống ly nước mía đứng đợi mưa tạnh. Vị ngọt thanh, mưa rào mùa hè — đây là Sài Gòn.',
    ],
  },
  {
    title: 'Một năm không uống rượu bia',
    paragraphs: [
      'Hôm nay tròn 365 ngày tôi không uống rượu bia — một quyết định tôi đưa ra vào tối Giao thừa năm ngoái khi nhìn lại sức khỏe bản thân.',
      'Không phải dễ. Tiệc công ty, đám cưới, gặp bạn bè — đều phải giải thích và từ chối. Nhưng dần dần mọi người cũng quen.',
      'Da dẻ khỏe hơn, ngủ tốt hơn, buổi sáng không còn đầu óc u ám. Năm thứ hai sẽ tiếp tục.',
    ],
  },
  {
    title: 'Ngày sinh nhật mẹ',
    paragraphs: [
      'Hôm nay sinh nhật mẹ. Tôi gọi về từ sáng sớm, hát Happy Birthday qua điện thoại — mẹ cười bảo tôi hát dở.',
      'Chuyển tiền về để mẹ tự mua món mẹ thích. Hỏi mẹ muốn gì, mẹ nói: "Con về nhà là được rồi".',
      'Nghe câu đó mà thấy sống mũi cay. Tháng tới thế nào cũng phải về.',
    ],
  },
  {
    title: 'Hoàng hôn trên đỉnh Fansipan',
    paragraphs: [
      'Sau 2 ngày leo bộ, tôi đứng trên đỉnh Fansipan lúc hoàng hôn. Mây trắng trải rộng bên dưới, ánh nắng vàng đỏ phía chân trời.',
      'Chân đau, người mệt, ba lô nặng — nhưng khoảnh khắc đó xứng đáng với mọi thứ.',
      'Đây là lần đầu tiên tôi leo núi thực sự. Chắc chắn sẽ không phải lần cuối.',
    ],
  },
];

/** Comment templates theo nhiều kiểu phản ứng */
const COMMENT_TEMPLATES = [
  'Bài viết hay lắm bạn ơi! Mình cũng từng trải qua cảm giác tương tự.',
  'Đọc xong thấy ấm lòng ghê. Cảm ơn bạn đã chia sẻ.',
  'Trời ơi, mình đồng cảm 100% với đoạn giữa bài. Chính xác là cảm giác của mình luôn.',
  'Viết hay quá! Bạn có nghĩ đến việc viết blog không?',
  'Đọc mà thấy nhớ ngày xưa quá. Cảm ơn bạn nha.',
  'Bài này mình phải đọc lại 2 lần. Sâu sắc thật.',
  'Haha mình cũng làm y chang vậy tuần trước 😂',
  'Mình ủng hộ bạn! Tiếp tục nhé.',
  'Thật ra mình cũng đang ở giai đoạn này. Đọc bài bạn thấy bớt cô đơn hơn.',
  'Trải nghiệm thú vị quá! Bạn có kể thêm không?',
  'Bạn viết rất chân thật. Hiếm thấy ai dám chia sẻ thẳng như vậy.',
  'Cảm ơn bạn vì bài viết này, đúng lúc mình cần đọc.',
  'Wow, Đà Lạt mùa đó đẹp thật. Mình cũng muốn đi lắm rồi.',
  'Ngưỡng mộ bạn vì dám thay đổi. Mình vẫn chưa dám thử.',
  'Mình cũng hay nấu ăn một mình, cảm giác lạ nhưng không cô đơn nhỉ.',
  'Tiếp tục nhé bạn! Mọi thứ rồi sẽ ổn thôi.',
  'Bài viết này làm mình muốn gọi điện về nhà ngay lúc này luôn.',
  'Sự trung thực trong bài viết của bạn làm mình rất cảm kích.',
  'Mình đọc và gật đầu suốt. Đúng y chang.',
  'Bạn có thể chia sẻ playlist nhạc không? Tò mò lắm!',
  'Mình cũng đang học Docker, có khi share kinh nghiệm với nhau nhỉ?',
  'Câu chuyện của bạn thật truyền cảm hứng. Cảm ơn đã chia sẻ!',
  'Đọc xong muốn đi bộ quanh Hồ Tây ngay bây giờ luôn.',
  'Giỏi quá! Mình tập gym 2 tuần thì bỏ rồi 😅',
  'Cảm ơn vì câu chuyện nhỏ nhặt nhưng đẹp này.',
  'Nhật ký của bạn đọc như một cuốn tiểu thuyết vậy, rất cuốn hút.',
  'Chúc bạn streak 30 ngày tiếp theo nha!',
  'Bài hay, mình bookmark lại để đọc lại sau.',
  'Câu chuyện bé chó trong thang máy làm mình cười to luôn 😂',
  'Mình hiểu cảm giác đó, rất hào hứng nhưng cũng hơi lo lắng.',
];

// ─── Seed function ────────────────────────────────────────────────────────────

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/diary_dev';

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('✅ Kết nối MongoDB thành công');

  // Xóa dữ liệu cũ
  await Promise.all([User.deleteMany({}), Diary.deleteMany({}), Comment.deleteMany({})]);
  console.log('🗑️  Đã xóa dữ liệu cũ');

  // ── 1. Tạo Users ───────────────────────────────────────────────────────────
  const PASSWORD = await bcrypt.hash('password123', 10);

  const usersData = [
    {
      username: 'Nguyễn Minh Tuấn',
      email: 'minhtuan@gmail.com',
      password: PASSWORD,
      bio: 'Lập trình viên ban ngày, nhà văn nghiệp dư ban đêm. Sống ở Hà Nội.',
    },
    {
      username: 'Trần Thị Lan Anh',
      email: 'lananh.tran@gmail.com',
      password: PASSWORD,
      bio: 'Yêu đọc sách, cà phê và những chuyến đi tự phát.',
    },
    {
      username: 'Lê Hoàng Phúc',
      email: 'hoangphuc.dev@gmail.com',
      password: PASSWORD,
      bio: 'Full-stack developer. Đang học Docker và uống quá nhiều cà phê.',
    },
    {
      username: 'Phạm Ngọc Hà',
      email: 'ngochadesign@gmail.com',
      password: PASSWORD,
      bio: 'UI/UX Designer. Mê phim indie và ảnh film.',
    },
    {
      username: 'Vũ Đức Thành',
      email: 'ducthanh.work@gmail.com',
      password: PASSWORD,
      bio: 'Backend engineer. Ít nói nhưng hay viết nhật ký.',
    },
    {
      username: 'Đỗ Thanh Mai',
      email: 'thanhmai.journal@gmail.com',
      password: PASSWORD,
      bio: 'Giáo viên tiếng Anh. Dùng nhật ký để xử lý cảm xúc mỗi ngày.',
    },
    {
      username: 'Bùi Quốc Khánh',
      email: 'khanh.bui@gmail.com',
      password: PASSWORD,
      bio: 'Data analyst. Chạy bộ buổi sáng và nấu ăn cuối tuần.',
    },
    {
      username: 'Ngô Thị Thu Hương',
      email: 'thuhuong.ngo@gmail.com',
      password: PASSWORD,
      bio: 'Kế toán tài chính. Sống chậm, nghĩ sâu.',
    },
  ];

  const users = await User.insertMany(usersData);
  console.log(`👥 Đã tạo ${users.length} người dùng`);

  // ── 2. Tạo Diaries ─────────────────────────────────────────────────────────
  // Insert lần lượt theo DIARY_TEMPLATES, round-robin user, không bị trùng bài
  const diariesData = [];

  // Số lượng diaries = đúng bằng số template (30 bài)
  for (let i = 0; i < DIARY_TEMPLATES.length; i++) {
    const template = DIARY_TEMPLATES[i];           // lần lượt từng template
    const user = users[i % users.length];          // round-robin user
    const isPublic = Math.random() > 0.2;
    const isDraft = !isPublic && Math.random() > 0.6;

    diariesData.push({
      title: template.title,
      content: buildHtml(template.paragraphs),
      isPublic,
      allowComments: isPublic && Math.random() > 0.1,
      selectedMood: rng(MOODS),
      tags: rngMany(ALL_TAGS, rngInt(1, 4)),
      coverPhoto: rng(COVER_PHOTOS),
      isDraft,
      userId: user._id,
      likes: [],
      likesCount: 0,
      createdAt: rngDate(365),
      updatedAt: rngDate(30),
    });
  }

  const diaries = await Diary.insertMany(diariesData);
  console.log(`📖 Đã tạo ${diaries.length} nhật ký`);

  // ── 3. Thêm likes ──────────────────────────────────────────────────────────
  const publicDiaries = diaries.filter(d => d.isPublic && !d.isDraft);
  for (const diary of publicDiaries) {
    const likers = rngMany(users, rngInt(0, Math.min(5, users.length)));
    diary.likes = likers.map(u => u._id);
    diary.likesCount = likers.length;
    await Diary.findByIdAndUpdate(diary._id, {
      likes: diary.likes,
      likesCount: diary.likesCount,
    });
  }
  console.log('❤️  Đã thêm likes cho nhật ký');

  // ── 4. Tạo Comments ────────────────────────────────────────────────────────
  const commentsData = [];
  const commentableDiaries = publicDiaries.filter(d => d.allowComments);

  for (const diary of commentableDiaries) {
    const commentCount = rngInt(0, 8);
    for (let i = 0; i < commentCount; i++) {
      const commenter = rng(users);
      commentsData.push({
        content: rng(COMMENT_TEMPLATES),
        userId: commenter._id,
        diaryId: diary._id,
        createdAt: rngDate(60),
        updatedAt: rngDate(30),
      });
    }
  }

  await Comment.insertMany(commentsData);
  console.log(`💬 Đã tạo ${commentsData.length} bình luận`);

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log('\n📊 Tóm tắt seed:');
  console.log(`   • Users    : ${users.length}`);
  console.log(`   • Diaries  : ${diaries.length} / ${DIARY_TEMPLATES.length} template (public: ${publicDiaries.length})`);
  console.log(`   • Comments : ${commentsData.length}`);
  console.log('\n🔑 Tài khoản mẫu (tất cả dùng password: password123):');
  users.forEach(u => console.log(`   ${u.email}`));

  await mongoose.disconnect();
  console.log('\n✅ Seed hoàn tất!');
}

seed().catch(err => {
  console.error('❌ Seed thất bại:', err);
  mongoose.disconnect();
  process.exit(1);
});