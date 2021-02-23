using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;
using PikeSafetyWebApp.Application.Interfaces;
using PikeSafetyWebApp.Data;
using PikeSafetyWebApp.Models;

namespace PikeSafetyWebApp.Application.ReportTypes
{
    public class List
    {
        public class Query : IRequest<List<ReportTypeDto>> { }

        public class Handler : IRequestHandler<Query, List<ReportTypeDto>>
        {
            private readonly PikeSafetyDbContext context;
            private readonly IModelConverters modelConverters;
            public Handler(PikeSafetyDbContext context, IModelConverters modelConverters)
            {
                this.context = context;
                this.modelConverters = modelConverters;
            }

            public async Task<List<ReportTypeDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                List<ReportType> types = await context.ReportTypes.ToListAsync();
                return Reduce(types);
            }

            private List<ReportTypeDto> Reduce(List<ReportType> records)
            {
                var list = records.ConvertAll(new Converter<ReportType, ReportTypeDto>(modelConverters.ReportTypeToReportTypeDto));
                return list;
            }
        }
    }
}