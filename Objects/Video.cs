using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace Vi2B.Objects {
	public class Video {
		public int? id { get; set; }
		public string name { get; set; }
		public string hash { get; set; }
		public int length { get; set; }
		public int created { get; set; }
		public int views { get; set; } = 0;
		public string description { get; set; } = "";
		public string videoType { get; set; } = null;
		public string thumbnailType { get; set; } = null;
		public bool uploaded { get; set; } = false;

		public void Save() {
			string query;
			bool isUpdate = (this.id != null && this.id >= 0);

			if (isUpdate) {
				query = @"UPDATE videos
						SET name = @name,
							hash = @hash,
							length = @length,
							created = @created,
							views = @views,
							description = @description,
							uploaded = @uploaded,
							videotype = @videoType,
							thumbnailtype = @thumbnailType
						WHERE id = @id";
			} else {
				query = @"INSERT INTO videos (name, hash, length, views, description, uploaded, created, videotype, thumbnailtype)
						OUTPUT INSERTED.id
						VALUES (@name, @hash, @length, @views, @description, @uploaded, @created, @videoType, @thumbnailType)";
			}

			SqlCommand command = new SqlCommand(query, DB.Connection);
			command.Parameters.AddWithValue("name", this.name);
			command.Parameters.AddWithValue("hash", this.hash);
			command.Parameters.AddWithValue("length", this.length);
			command.Parameters.AddWithValue("created", this.created);
			command.Parameters.AddWithValue("views", this.views);
			command.Parameters.AddWithValue("description", this.description);
			command.Parameters.AddWithValue("uploaded", this.uploaded);

			if (this.videoType == null)
				command.Parameters.AddWithValue("videoType", DBNull.Value);
			else
				command.Parameters.AddWithValue("videoType", this.videoType);

			if (this.thumbnailType == null)
				command.Parameters.AddWithValue("thumbnailType", DBNull.Value);
			else
				command.Parameters.AddWithValue("thumbnailType", this.thumbnailType);

			if (isUpdate) {
				command.Parameters.AddWithValue("id", this.id);
				command.ExecuteNonQuery();
			} else {
				id = (int) command.ExecuteScalar();
			}
		}

		public static Video Get(int id) {
			string sql = @"SELECT TOP 1 * FROM videos WHERE id = @id";

			SqlCommand command = new SqlCommand(sql, DB.Connection);
			command.Parameters.AddWithValue("id", id);
			SqlDataReader reader = command.ExecuteReader();
			command.Dispose();

			if (!reader.Read()) {
				reader.Close();
				throw new KeyNotFoundException("Video with id " + id + " does not exist!");
			}

			Video video = ProcessRecord(reader);
			reader.Close();

			return video;
		}

		public static Video Get(string hash) {
			string sql = @"SELECT TOP 1 * FROM videos WHERE hash = @hash";

			SqlCommand command = new SqlCommand(sql, DB.Connection);
			command.Parameters.AddWithValue("hash", hash);
			SqlDataReader reader = command.ExecuteReader();
			command.Dispose();

			if (!reader.Read()) {
				reader.Close();
				throw new KeyNotFoundException("Video with hash " + hash + " does not exist!");
			}

			Video video = ProcessRecord(reader);
			reader.Close();

			return video;
		}

		public static List<Video> GetAll() {
			List<Video> videos = new List<Video>() { };

			string sql = @"SELECT * FROM videos";

			SqlCommand command = new SqlCommand(sql, DB.Connection);
			SqlDataReader reader = command.ExecuteReader();
			command.Dispose();

			while (reader.Read())
				videos.Add(ProcessRecord(reader));

			reader.Close();
			return videos;
		}

		public static Video ProcessRecord(SqlDataReader reader) {
			Video video = new Video();
			video.id = (int) reader["id"];
			video.name = reader["name"].ToString();
			video.hash = reader["hash"].ToString();
			video.length = int.Parse(reader["length"].ToString());
			video.created = int.Parse(reader["created"].ToString());
			video.views = int.Parse(reader["views"].ToString());
			video.description = reader["description"].ToString();
			video.videoType = reader["videoType"].ToString();
			video.thumbnailType = reader["thumbnailType"].ToString();
			video.uploaded = (bool) reader["uploaded"];

			return video;
		}
	}
}