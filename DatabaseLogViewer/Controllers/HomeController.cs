﻿using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using DatabaseLogViewer.Models;

namespace DatabaseLogViewer.Controllers
{
	public class HomeController : Controller
    {
		public IActionResult Index()
        {
            return View();
        }

        public IActionResult About()
        {
            return View();
        }

        public IActionResult Contact()
        {
            return View();
        }

        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
