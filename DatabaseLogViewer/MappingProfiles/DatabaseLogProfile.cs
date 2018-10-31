using AutoMapper;
using DatabaseLogViewer.Entities;
using DatabaseLogViewer.Models;

namespace DatabaseLogViewer.MappingProfiles
{
    public class DatabaseLogProfile : Profile
    {
		public DatabaseLogProfile()
		{
			CreateMap<DatabaseLog, LogViewModel>()
				.ForMember(dbLog => dbLog.DatabaseLogID, opt => opt.MapFrom(entity => entity.DatabaseLogID))
				.ForMember(dbLog => dbLog.DatabaseUser, opt => opt.MapFrom(entity => entity.DatabaseUser))
				.ForMember(dbLog => dbLog.Schema, opt => opt.MapFrom(entity => entity.Schema))
				.ForMember(dbLog => dbLog.Object, opt => opt.MapFrom(entity => entity.Object))
				.ForMember(dbLog => dbLog.TSQL, opt => opt.MapFrom(entity => entity.TSQL));
		}
    }
}
