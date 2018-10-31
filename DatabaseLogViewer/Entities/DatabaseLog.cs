using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.SqlTypes;

namespace DatabaseLogViewer.Entities
{
	public class DatabaseLog
	{
		[Column(TypeName = "int")]
		public int DatabaseLogID { get; set; }

		[Column(TypeName = "nvarchar"), StringLength(128)]
		public string DatabaseUser { get; set; }

		[Column(TypeName = "nvarchar"), StringLength(128)]
		public string Event { get; set; }

		[Column(TypeName = "nvarchar"), StringLength(128)]
		public string Schema { get; set; }

		[Column(TypeName = "nvarchar"), StringLength(128)]
		public string Object { get; set; }

		[Column(TypeName = "nvarchar"), MaxLength]
		public string TSQL { get; set; }

		[Column(TypeName = "datetime")]
		public string PostTime { get; set; }

		[Column(TypeName = "XML")]
		public string XmlEvent { get; set; }
	}
}