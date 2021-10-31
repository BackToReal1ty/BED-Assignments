CREATE DATABASE  IF NOT EXISTS `sp_movie` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `sp_movie`;
-- MySQL dump 10.13  Distrib 8.0.25, for Win64 (x86_64)
--
-- Host: localhost    Database: sp_movie
-- ------------------------------------------------------
-- Server version	8.0.25

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `genre`
--

DROP TABLE IF EXISTS `genre`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `genre` (
  `genreid` int NOT NULL AUTO_INCREMENT,
  `genre` varchar(255) NOT NULL,
  `description` varchar(1000) NOT NULL,
  PRIMARY KEY (`genreid`),
  UNIQUE KEY `genre_UNIQUE` (`genre`),
  UNIQUE KEY `genreid_UNIQUE` (`genreid`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `genre`
--

LOCK TABLES `genre` WRITE;
/*!40000 ALTER TABLE `genre` DISABLE KEYS */;
INSERT INTO `genre` VALUES (1,'Action','A genre in which the protagonist or protagonists are thrust into a series of events that typically include violence, extended fighting, physical feats, rescues and frantic chases.'),(2,'Comedy','A genre in which the main emphasis is on humor.'),(3,'Horror','A genre of speculative fiction which is intended to frighten, scare, or disgust.'),(4,'Tragedy','A genre in which a hero is brought down by his/her own flaws, usually by ordinary human flaws – flaws like greed, over-ambition, or even an excess of love, honor, or loyalty.'),(5,'Adventure','Adventurous'),(6,'Science Fiction','Scifi'),(7,'Romance','Kiss and hugs'),(8,'Thriller','Thrilling'),(9,'Family','Its family time'),(10,'War','Pew Pew');
/*!40000 ALTER TABLE `genre` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gmkey`
--

DROP TABLE IF EXISTS `gmkey`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gmkey` (
  `fkeyid` int NOT NULL AUTO_INCREMENT,
  `genreid` int NOT NULL,
  `movieid` int NOT NULL,
  PRIMARY KEY (`fkeyid`),
  UNIQUE KEY `fkeyid_UNIQUE` (`fkeyid`),
  KEY `genreid_idx` (`genreid`),
  KEY `movieid_idx` (`movieid`),
  CONSTRAINT `fkey_gmkey_genreid` FOREIGN KEY (`genreid`) REFERENCES `genre` (`genreid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fkey_gmkey_movieid` FOREIGN KEY (`movieid`) REFERENCES `movie` (`movieid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gmkey`
--

LOCK TABLES `gmkey` WRITE;
/*!40000 ALTER TABLE `gmkey` DISABLE KEYS */;
INSERT INTO `gmkey` VALUES (1,1,1),(2,1,2),(3,2,2),(4,2,3),(5,3,3),(6,1,5),(7,5,5),(8,1,6),(9,2,6),(10,5,6),(11,3,7),(12,4,7),(13,5,7),(14,1,8),(15,2,8),(16,5,9),(17,6,9),(18,1,10),(19,2,10),(20,8,10);
/*!40000 ALTER TABLE `gmkey` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `movie`
--

DROP TABLE IF EXISTS `movie`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movie` (
  `movieid` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` varchar(1000) NOT NULL,
  `cast` varchar(1000) NOT NULL,
  `time` varchar(255) NOT NULL,
  `opening_date` varchar(255) NOT NULL,
  PRIMARY KEY (`movieid`),
  UNIQUE KEY `title_UNIQUE` (`title`),
  UNIQUE KEY `movieid_UNIQUE` (`movieid`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movie`
--

LOCK TABLES `movie` WRITE;
/*!40000 ALTER TABLE `movie` DISABLE KEYS */;
INSERT INTO `movie` VALUES (1,'Fast & Furious 9','Vin Diesel\'s Dom Toretto is leading a quiet life off the grid with Letty and his son, little Brian, but they know that danger always lurks just over their peaceful horizon. This time, that threat will force Dom to confront the sins of his past if hes going to save those he loves most. His crew joins together to stop a world-shattering plot led by the most skilled assassin and high-performance driver they\'ve ever encountered: a man who also happens to be Dom\'s forsaken brother, Jakob (John Cena, next year\'s The Suicide Squad).','Vin Diesel, Michelle Rodriguez, John Cena, Jordana Brewster, Tyrese Gibson, Ludacris, Nathalie Emmanuel','143 minutes','01-07-2021'),(2,'1921','In 1921, Shanghai was overflowing with tension. Young people from all over the world, with an average age of only 28, broke through the monitoring and tracking of various international forces and gathered in Shanghai to create the Communist Party of China. From then on, a new chapter in Chinese history was born.','Huang Xuan 黄轩, Ni Ni 倪妮, Wang Renjun 王仁君, Liu Haoran 刘昊然, Chen Kun 陈坤','138 minutes','01-07-2021'),(3,'Marvel Studios\' Black Widow','Scarlett Johansson reprises her role as Natasha/Black Widow in Marvel Studios\' action-packed spy thriller Black Widow- the first film in Phase Four of the Marvel Cinematic Universe. Florence Pugh stars as Yelena, David Harbour as Alexei aka The Red Guardian and Rachel Weisz as Melina. Directed by Cate Shortland and produced by Kevin Feige.','Scarlett Johansson, Florence Pugh, David Harbour, Rachel Weisz','134 minutes','08-07-2021'),(4,'Disney\'s Cruella','Academy Award winner Emma Stone (\"La La Land\") stars in Disney\'s \"Cruella,\" an all-new live-action feature film about the rebellious early days of one of cinemas most notorious - and notoriously fashionable - villains, the legendary Cruella de Vil. \"Cruella,\" which is set in 1970s London amidst the punk rock revolution, follows a young grifter named Estella, a clever and creative girl determined to make a name for herself with her designs...','Emma Stone, Emma Thompson','134 minutes','27-05-2021'),(5,'The Suicide Squad','Welcome to hell—a.k.a. Belle Reve, the prison with the highest mortality rate in the US of A. Where the worst Super-Villains are kept and where they will do anything to get out—even join the super-secret, super-shady Task Force X. Today’s do-or-die assignment? Assemble a collection of cons, including Bloodsport, Peacemaker, Captain Boomerang, Ratcatcher 2, Savant, King Shark, Blackguard, Javelin and everyone’s favorite psycho, Harley Quinn.',' Margot Robbie, Jai Courtney, Joel Kinnaman, Viola Davis, John Cena, Pete Davidson, Michael Rooker, Sean Gunn, Idris Elba ','132 minutes','05-08-2021'),(6,'Disney\'s Jungle Cruise','Inspired by the famous Disneyland theme park ride, Disney’s JUNGLE CRUISE is an adventure-filled, Amazon-jungle expedition starring Dwayne Johnson as the charismatic riverboat captain and Emily Blunt as a determined explorer on a research mission. Also starring in the film are Edgar Ramirez, Jack Whitehall, with Jesse Plemons, and Paul Giamatti.',' Dwayne Johnson, Emily Blunt, Edgar Ramirez, Jack Whitehall, Jesse Plemons, Paul Giamatti','127 minutes','29-07-2021'),(7,'The Medium','A documentary team follows Nim, a shaman based in Northern Thai, the Isan area, and encounters her niece Mink showing strange symptoms that seem to be of inheritance of shamanism. The team decides to follow Mink, hoping to capture the shaman lineage passing on to the next generation, but her bizarre behaviour becomes more extreme.',' Narilya Gulmongkolpech, Sawanee Utoomma, Sirani Yankittikan','131 minutes','12-08-2021'),(8,'Blackpink The Movie','The girl group beloved by the world, ‘BLACKPINK’ celebrates the 5th anniversary of their debut with the release of BLACKPINK THE MOVIE, it is also a special gift for ‘BLINKs’—BLACKPINK’s beloved fandom—to revisit old memories and enjoy the passionate performances in the festive spirit. BLACKPINK—consisting of JISOO, JENNIE, ROSÉ, and LISA—has been growing explosively ever since they first stepped out into the world on August 8th, 2016, along with its fandom ‘BLINK.’','JISOO, JENNIE, ROSÉ, LISA','100 minutes','04-08-2021'),(9,'The Ice Road','After a remote diamond mine collapses in far northern Canada, a ‘big-rig’ ice road driver Mike McCann (LIAM NEESON) must lead an impossible rescue mission over a frozen ocean to save the trapped miners before their oxygen runs out. Contending with thawing waters and a massive storm, they discover the real threat is one they never saw coming.',' Liam Neeson, Laurence J. Fishburne III, Marcus Thomas, Amber Midthunder, Benjamin Walker','109 minutes','15-07-2021'),(10,'Space Jam: A New Legacy','Welcome to the Jam! NBA champion and global icon LeBron James goes on an epic adventure alongside timeless Tune Bugs Bunny with the animated/live-action event \"Space Jam: A New Legacy,\" from director Malcolm D. Lee and an innovative filmmaking team including Ryan Coogler and Maverick Carter. This transformational journey is a manic mashup of two worlds that reveals just how far some parents will go to connect with their kids.','LeBron James, Don Cheadle, Benjamin Flores Jr., Zendaya ','116 minutes','15-07-2021');
/*!40000 ALTER TABLE `movie` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `photo`
--

DROP TABLE IF EXISTS `photo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `photo` (
  `photoid` int NOT NULL AUTO_INCREMENT,
  `movieid` int NOT NULL,
  `path` varchar(255) NOT NULL,
  PRIMARY KEY (`photoid`),
  KEY `FK_photo_movie_idx` (`movieid`),
  CONSTRAINT `FK_photo_movie` FOREIGN KEY (`movieid`) REFERENCES `movie` (`movieid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `photo`
--

LOCK TABLES `photo` WRITE;
/*!40000 ALTER TABLE `photo` DISABLE KEYS */;
INSERT INTO `photo` VALUES (1,1,'photo_1628064168754.jpg'),(2,2,'photo_1628064179162.jpg'),(3,3,'photo_1628064186958.jpeg'),(4,4,'photo_1628096191707.jpg'),(5,5,'poster_1628533171712.jpg'),(6,6,'poster_1628533512133.jpg'),(7,7,'poster_1628533556559.jpg'),(8,8,'poster_1628533568133.jpg'),(9,9,'poster_1628533578297.jpg'),(10,10,'poster_1628533601707.jpg');
/*!40000 ALTER TABLE `photo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `review`
--

DROP TABLE IF EXISTS `review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `review` (
  `reviewid` int NOT NULL AUTO_INCREMENT,
  `userid` int NOT NULL,
  `movieid` int NOT NULL,
  `rating` int NOT NULL,
  `review` varchar(1000) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`reviewid`),
  UNIQUE KEY `reviewid_UNIQUE` (`reviewid`),
  KEY `movieid_idx` (`movieid`),
  KEY `userid_idx` (`userid`),
  CONSTRAINT `fkey_review_movie` FOREIGN KEY (`movieid`) REFERENCES `movie` (`movieid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fkey_review_user` FOREIGN KEY (`userid`) REFERENCES `user` (`userid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `review`
--

LOCK TABLES `review` WRITE;
/*!40000 ALTER TABLE `review` DISABLE KEYS */;
INSERT INTO `review` VALUES (1,2,1,4,'Good movie, would watch again','2021-07-04 05:38:18'),(2,3,2,1,'Boring movie, not worth the 2 hours','2021-07-04 05:38:40'),(3,1,2,5,'Great movie, would definitely recommend','2021-07-04 05:39:21'),(4,2,4,3,'Average rating.','2021-07-04 10:35:20'),(5,5,10,5,'good','2021-08-09 18:39:11');
/*!40000 ALTER TABLE `review` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `timeslot`
--

DROP TABLE IF EXISTS `timeslot`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `timeslot` (
  `timeslotid` int NOT NULL AUTO_INCREMENT,
  `movieid` int NOT NULL,
  `date` varchar(255) NOT NULL,
  `time_start` varchar(255) NOT NULL,
  `time_end` varchar(255) NOT NULL,
  PRIMARY KEY (`timeslotid`),
  UNIQUE KEY `timeslotid_UNIQUE` (`timeslotid`),
  KEY `fkey_timeslot_movie_idx` (`movieid`),
  CONSTRAINT `fkey_timeslot_movie` FOREIGN KEY (`movieid`) REFERENCES `movie` (`movieid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `timeslot`
--

LOCK TABLES `timeslot` WRITE;
/*!40000 ALTER TABLE `timeslot` DISABLE KEYS */;
INSERT INTO `timeslot` VALUES (1,2,'04-07-2021','11:30','13:23'),(2,2,'05-07-2021','15:00','17:23'),(3,2,'05-07-2021','19:00','21:23'),(4,1,'05-07-2021','19:00','21:23');
/*!40000 ALTER TABLE `timeslot` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `userid` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `contact` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `type` varchar(45) NOT NULL DEFAULT 'customer',
  `profile_pic_url` varchar(45) NOT NULL DEFAULT 'default.png',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`userid`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  UNIQUE KEY `contact_UNIQUE` (`contact`),
  UNIQUE KEY `userid_UNIQUE` (`userid`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'Jamieoliver23','Jamieoliver23@gmail.com','87654321','root','customer','default.png','2021-07-04 13:02:08'),(2,'Gordonramsay12','Gordonramsay12@gmail.com','87654322','root','customer','default.png','2021-07-04 13:04:32'),(3,'Jameshoffmann565','Jameshoffmann564@gmail.com','87654324','root','customer','default.png','2021-07-04 13:05:57'),(4,'liuxinisad','liuxinisad@gmail.com','87654325','root','customer','default.png','2021-07-04 18:15:49'),(5,'admin','admin@gmail.com','88888888','root','admin','default.png','2021-08-09 17:56:52'),(6,'Jack Anderson','jackanderson@gmail.com','12381232','root','customer','default.png','2021-08-09 17:58:57'),(7,'josephwilliams','josephwilliams@gmail.com','12318798','root','customer','default.png','2021-08-09 17:59:12'),(17,'LaoiseSuzanne','LaoiseSuzanne@gmail.com','12312889','root','customer','default.png','2021-08-09 18:06:08'),(18,'MadailéinHaruto','MadailéinHaruto@gmail.com','89891233','root','customer','default.png','2021-08-09 18:06:27'),(19,'ChantalNives','ChantalNives@gmail.com','123123125','root','customer','default.png','2021-08-09 18:06:46');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-08-10  2:39:48
